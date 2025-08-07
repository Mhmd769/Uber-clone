import { neon } from '@neondatabase/serverless';




export async function POST(request : Request){
  try{
    const sql = neon(`${process.env.DATABASE_URL}`);
    console.log('Using DATABASE_URL:', process.env.DATABASE_URL);

    const {name,email,clerkId} = await request.json();
    console.log('Received data:', { name, email, clerkId });

    if(!name || !email || !clerkId){
      console.log('Missing required fields');
      return Response.json({error:"Missing Required Fields"},{status:400})
    }
    const response =await sql`
      INSERT INTO users(
        name,
        email,
        clerk_id
      )
      VALUES(
        ${name},
        ${email},
        ${clerkId}
      )
      RETURNING *
    `;
    console.log('Insert response:', response);

    return new Response(JSON.stringify({data:response}),
    {status:200})

  }catch(error){
    if (error && typeof error === 'object' && 'code' in error && error.code === '23505') {
      // Duplicate key error (unique constraint violation)
      return Response.json({ error: 'An account with this email already exists.' }, { status: 409 });
    }
    console.log('Error in POST /api/user:', error);
    return Response.json({error:error},
      {status:500}
    )
  }
}