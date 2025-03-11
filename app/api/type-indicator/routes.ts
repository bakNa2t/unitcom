import { NextResponse } from "next/server";
import configPusher from "@/lib/pusher/config";

export const POST = async (req: Request, res: Response) => {
  const { channel, event, data } = await req.json();

  try {
    await configPusher.trigger(channel, event, data);

    if (res) console.log(res);
  } catch (error) {
    console.log("Error sending pusher event", error);
  }

  return NextResponse.json({ success: true }, { status: 200 });
};
