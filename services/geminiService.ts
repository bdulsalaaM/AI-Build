
import { GoogleGenAI, Type } from "@google/genai";
import { BookingDetails, ServiceType, RideOption, CourierQuote } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const rideSchema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      type: { type: Type.STRING, description: "Type of ride (e.g., 'Economy', 'Keke', 'Comfort')" },
      fare: { type: Type.STRING, description: "Estimated fare in Nigerian Naira (e.g., '₦2500 - ₦3000')" },
      eta: { type: Type.STRING, description: "Estimated time of arrival for the ride in minutes (e.g., '5 mins')" },
      description: { type: Type.STRING, description: "A brief, appealing description of the ride type." },
      icon: { type: Type.STRING, description: "An icon identifier from this list: 'car', 'bike', 'luxury'" }
    },
    required: ["type", "fare", "eta", "description", "icon"],
  },
};

const courierSchema = {
    type: Type.OBJECT,
    properties: {
        fare: { type: Type.STRING, description: "Estimated cost in Nigerian Naira (e.g., '₦1500')" },
        eta: { type: Type.STRING, description: "Estimated delivery time (e.g., '2-3 hours')" },
        description: { type: Type.STRING, description: "A summary of the courier service for this delivery." },
        trackingId: { type: Type.STRING, description: "A generated fictional tracking ID (e.g., 'NG-GO-12345678')" },
    },
    required: ["fare", "eta", "description", "trackingId"],
};

export const generateRideAndCourierOptions = async (details: BookingDetails): Promise<{ rideOptions?: RideOption[]; courierQuote?: CourierQuote }> => {
  try {
    const isRide = details.service === ServiceType.Ride;

    const systemInstruction = `You are a helpful assistant for 'NaijaGo', a ride-sharing and courier app in Nigeria. Generate realistic and appealing service options based on the user's request. All monetary values should be in Nigerian Naira (₦).`;

    let prompt: string;
    let schema: object;

    if (isRide) {
      prompt = `A user in Nigeria wants to book a ride from "${details.pickup}" to "${details.dropoff}". Provide 3 distinct ride options for them. Include 'Keke' as one of the options if the distance seems short or within a city.`;
      schema = rideSchema;
    } else {
      prompt = `A user in Nigeria wants to send a package from "${details.pickup}" to "${details.dropoff}". The package is: "${details.packageDetails}". Provide a courier quote.`;
      schema = courierSchema;
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: schema,
      },
    });

    const jsonResponse = JSON.parse(response.text.trim());

    if (isRide) {
        return { rideOptions: jsonResponse as RideOption[] };
    } else {
        return { courierQuote: jsonResponse as CourierQuote };
    }

  } catch (error) {
    console.error("Error generating options with Gemini:", error);
    throw new Error("Failed to get options. Please try again.");
  }
};
