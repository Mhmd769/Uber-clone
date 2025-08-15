import { neon } from "@neondatabase/serverless";

export async function GET(request: Request) {
  try {
    const sql = neon(`${process.env.DATABASE_URL}`);
    const response = await sql`SELECT * FROM drivers`;

    return Response.json({ data: response });
  } catch (error) {
    console.error("Error fetching drivers:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}


export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      first_name,
      last_name,
      profile_image_url,
      car_image_url,
      car_seats,
      rating,
    } = body;

    const sql = neon(`${process.env.DATABASE_URL}`);

    try {
      const insertedDriver = await sql`
        INSERT INTO drivers
          (first_name, last_name, profile_image_url, car_image_url, car_seats, rating)
        VALUES
          (${first_name}, ${last_name}, ${profile_image_url}, ${car_image_url}, ${car_seats}, ${rating})
        RETURNING *;
      `;
      console.log("[Driver API] Inserted driver:", insertedDriver);
      return new Response(JSON.stringify({ data: insertedDriver }), { status: 200 });
    } catch (dbError) {
      console.error("[Driver API] DB insertion error:", dbError);
      return new Response(
        JSON.stringify({
          error: "Database insertion failed",
          details: dbError instanceof Error ? dbError.message : String(dbError),
        }),
        { status: 500 }
      );
    }

  } catch (err) {
    console.error("[Driver API] General error:", err);
    return new Response(
      JSON.stringify({
        error: "Invalid request or server error",
        details: err instanceof Error ? err.message : String(err),
      }),
      { status: 500 }
    );
  }
}
