import {
    CheckCircle2,
    XCircle,
} from "lucide-react";

export default function VerificationMatrix({

    verification,

}) {

    const rows = [

        ["Registry", verification.registry],

        ["Document DNA", verification.dna],

        ["Metadata", verification.metadata],

        ["SHA-256", verification.sha256],

        ["Text Integrity", verification.text],

        ["Page Count", verification.pageCount],

    ];

    return (

        <div className="rounded-2xl border border-slate-700 bg-[#16213A] p-6">

            <h2 className="mb-6 text-2xl font-bold">

                Verification Matrix

            </h2>

            <div className="space-y-4">

                {rows.map(([title,value])=>(

                    <div

                        key={title}

                        className="flex items-center justify-between rounded-xl bg-[#111B33] p-4"

                    >

                        <span>

                            {title}

                        </span>

                        {value ? (

                            <CheckCircle2 className="text-green-400"/>

                        ):(
                            <XCircle className="text-red-400"/>
                        )}

                    </div>

                ))}

            </div>

        </div>

    );

}