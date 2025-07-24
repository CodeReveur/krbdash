import { NextRequest, NextResponse } from "next/server";
import client from "../../utils/db";
import uploadDocumentToSupabase from "../../utils/supabase";

// Define types for the Research request
type ResearchRequest = {
  title: string;
  researcher: string;
  category: string;
  status: string;
  year: string;
  abstract: string;
  user_id: string;
  document: File;
};

// Helper function to hash the Research ID
async function hashId(id: number): Promise<string> {
  const textEncoder = new TextEncoder();
  const encoded = textEncoder.encode(id.toString());
  const hashBuffer = await crypto.subtle.digest("SHA-256", encoded);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  return hashHex;
}

// Handle POST request for adding a Research
export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const formData = await req.formData();
    
    // Extract data from FormData
    const researchData: ResearchRequest = {
      title: formData.get('title')?.toString() || '',
      researcher: formData.get('researcher')?.toString() || '',
      category: formData.get('category')?.toString() || '',
      status: formData.get('status')?.toString() || '',
      year: formData.get('year')?.toString() || '',
      abstract: formData.get('abstract')?.toString() || '',
      user_id: formData.get('user_id')?.toString() || '',
      document: formData.get('document') as File,
    };

    // Validate required fields
    if (!researchData.title || !researchData.category || !researchData.researcher || 
        !researchData.status || !researchData.year || !researchData.user_id || 
        !researchData.document || !researchData.abstract) {
      return NextResponse.json(
        { error: "All fields are required" }, 
        { status: 400 }
      );
    }

    // Upload the document to Supabase
    const documentUrl = await uploadDocumentToSupabase(researchData.document, researchData.title);
    const doc_type = researchData.document.type;
    const approval_status = "Pending"; // Initial approval status
    const progress_status = researchData.status; // This is the research progress status (ongoing/completed/pending)

    // Insert research into the database (without institution and school)
    const result = await client.query(
      `INSERT INTO researches (
        title, 
        researcher, 
        category, 
        status, 
        progress_status, 
        document, 
        year, 
        abstract, 
        document_type, 
        user_id, 
        created_at, 
        updated_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW(), NOW()) 
      RETURNING *`,
      [
        researchData.title, 
        researchData.researcher, 
        researchData.category, 
        approval_status, 
        progress_status, 
        documentUrl, 
        researchData.year, 
        researchData.abstract, 
        doc_type, 
        researchData.user_id
      ]
    );
    
    const researchId = result.rows[0].id;

    // Hash the Research ID
    const hashedResearchId = await hashId(researchId);

    // Update the Research with the hashed ID
    await client.query(
      `UPDATE researches SET hashed_id = $1 WHERE id = $2`,
      [hashedResearchId, researchId]
    );

    // Get the updated research record
    const updatedResult = await client.query(
      `SELECT * FROM researches WHERE id = $1`,
      [researchId]
    );
  
    return NextResponse.json(
      { 
        message: "Research added successfully", 
        research: updatedResult.rows[0] 
      }, 
      { status: 201 }
    );
  } catch (error) {
    console.error("Error during Research addition:", error);
    return NextResponse.json(
      { 
        message: "Researchaddition failed",
        error: error instanceof Error ? error.message : "Unknown error occurred"
      },
      { status: 500 }
    );
  }
}