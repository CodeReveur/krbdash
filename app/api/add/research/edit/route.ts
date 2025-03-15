import client from "@/app/api/utils/db";
import uploadDocumentToSupabase, { deleteDocumentFromSupabase } from "@/app/api/utils/supabase";
import { NextRequest, NextResponse } from "next/server";

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
  changed_by: string;
  research_id: string;
  current_file: string;
  document: File;
};

/*function splitByKRB(word: string) {
  const parts = word.split("/krb/");
  
  if (parts.length === 1) {
      return { left: word, right: "" }; // If 'krb' is not found
  }

  return { left: parts[0], right: parts.slice(1).join("krb") }; // Preserve everything after 'krb'
}*/
// Handle POST request for adding a Institution
export async function POST(req: NextRequest): Promise<NextResponse> {

  try {
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
      changed_by: formData.get('user_id')?.toString() || '',
      research_id: formData.get('research_id')?.toString() || '',
      current_file: formData.get('current_file')?.toString() || '',
      document: formData.get('document') as File, // Get the document file directly
    };
    console.log("recieved: ",researchData)
    // Validate required fields
    if (!researchData.title || !researchData.current_file || !researchData.category || !researchData.researcher || !researchData.status || !researchData.school || !researchData.institution  || !researchData.year || !researchData.changed_by || !researchData.research_id) {
      return NextResponse.json({ error: "All fields are required" }, { status: 402 });
    }

     // Upload the document to Supabase
   //  const file_to_remove = splitByKRB(researchData.current_file);
     //await deleteDocumentFromSupabase (file_to_remove.right);
     
     const document = await uploadDocumentToSupabase(researchData.document, researchData.title);
     const doc_type = researchData.document.type;
     const status = "Pending";
     const content = "Permission to review and merge changes";
     const progress_status = researchData.status;
 
     // Insert researches into the database
     const result = await client.query(
       `INSERT INTO research_changes (title, researcher, category, status, progress_status, document, year, school, institution, abstract, document_type, research_id, changed_by, content, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, NOW()) RETURNING *`,
       [researchData.title, researchData.researcher, researchData.category, status, progress_status, document, researchData.year, researchData.school, researchData.institution, researchData.abstract, doc_type, researchData.research_id, researchData.changed_by, content]
     );


      // Mark original research as "Pending Approval"
    await client.query(`UPDATE researches SET approval_requested = TRUE WHERE id = $1`, [researchData.research_id]);
    
    

    return NextResponse.json({ message: "Changes saved for review!", Research: result.rows[0] }, { status: 201 });
  } catch (error) {
    console.error("Error during Research addition:", error); // Log only the message
    return NextResponse.json(
        { message: "Research addition failed", error: error }, 
        { status: 500 }
    );
  }
}
