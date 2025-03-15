import { NextRequest, NextResponse } from "next/server";
import client from "../../utils/db";
import uploadDocumentToSupabase from "../../utils/supabase";

// Define types for the Institution request
type InstitutionRequest = {
  title: string;
  researcher: string;
  category: string;
  institution: string;
  status: string;
  school: string;
  year: string;
  abstract: string;
  user_id: string;
  document: File;
};

// Helper function to hash the Institution ID
async function hashId(id: number): Promise<string> {
  const textEncoder = new TextEncoder();
  const encoded = textEncoder.encode(id.toString());
  const hashBuffer = await crypto.subtle.digest("SHA-256", encoded);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  return hashHex;
}
// Handle POST request for adding a Institution
export async function POST(req: NextRequest): Promise<NextResponse> {
  const formData = await req.formData();
  const researchData: InstitutionRequest = {
    title: formData.get('title')?.toString() || '',
    researcher: formData.get('researcher')?.toString() || '',
    category: formData.get('category')?.toString() || '',
    institution: formData.get('institution')?.toString() || '',
    status: formData.get('status')?.toString() || '',
    school: formData.get('school')?.toString() || '',
    year: formData.get('year')?.toString() || '',
    abstract: formData.get('abstract')?.toString() || '',
    user_id: formData.get('user_id')?.toString() || '',
    document: formData.get('document') as File, // Get the document file directly
  };

  console.log("Received data: ", researchData); // Log the Institution data for debugging

  // Validate required fields
  if (!researchData.title || !researchData.category || !researchData.researcher || !researchData.status || !researchData.school || !researchData.institution  || !researchData.year || !researchData.user_id) {
    return NextResponse.json({ error: "All fields are required" }, { status: 400 });
  }

  try {
    // Upload the document to Supabase
    const document = await uploadDocumentToSupabase(researchData.document, researchData.title);
    const doc_type = researchData.document.type;
    const status = "Pending";
    const progress_status = researchData.status;

    // Insert researches into the database
    const result = await client.query(
      `INSERT INTO researches (title, researcher, category, status, progress_status, document, year, school, institution, abstract, document_type, hashed_id, user_id, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, NOW(), NOW()) RETURNING *`,
      [researchData.title, researchData.researcher, researchData.category, status, progress_status, document, researchData.year, researchData.school, researchData.institution, researchData.abstract, doc_type, hashId, researchData.user_id]
    );
    const ResearchId = result.rows[0].id;

    // Hash the Research ID
    const hashedResearchId = await hashId(ResearchId);

    // Update the Research with the hashed ID (for additional usage in the response)
    await client.query(
      `UPDATE researches SET hashed_id = $1 WHERE id = $2`,
      [hashedResearchId, ResearchId]
    );
  
    return NextResponse.json({ message: "Research added successfully", Research: result.rows[0] }, { status: 201 });
  } catch (error) {
    console.error("Error during Research addition:", error); // Log only the message
    return NextResponse.json(
        { message: "Research addition failed", error: error }, 
        { status: 500 }
    );
}

}
