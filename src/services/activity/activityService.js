import { supabase } from "../../lib/supabase";

export async function getRecentActivities() {

    const activities = [];

    // -----------------------
    // Documents
    // -----------------------

    const { data: documents } = await supabase

        .from("documents")

        .select("id,title,created_at")

        .order("created_at", {

            ascending: false,

        })

        .limit(5);

    documents?.forEach(doc =>

        activities.push({

            id: "doc-" + doc.id,

            title: `Protected document "${doc.title}" registered`,

            created_at: doc.created_at,

            type: "document",

        })

    );

    // -----------------------
    // Investigations
    // -----------------------

    const { data: investigations } = await supabase

        .from("investigations")

        .select("id,investigated_at,risk")

        .order("investigated_at", {

            ascending: false,

        })

        .limit(5);

    investigations?.forEach(inv =>

        activities.push({

            id: "inv-" + inv.id,

            title: `Investigation completed (${inv.risk})`,

            created_at: inv.investigated_at,

            type: "investigation",

        })

    );

    // -----------------------
    // Sort newest first
    // -----------------------

    activities.sort(

        (a, b) =>

            new Date(b.created_at) -

            new Date(a.created_at)

    );

    return activities.slice(0, 10);

}