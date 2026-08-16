export default function SemanticFindings({

    findings,

}){

    return(

        <div className="rounded-2xl border border-slate-700 bg-[#16213A] p-6">

            <h2 className="mb-6 text-2xl font-bold">

                Semantic Analysis

            </h2>

            {

                findings.length===0 ?

                (

                    <p>

                        No semantic modifications detected.

                    </p>

                )

                :

                findings.map((item,index)=>(

                    <div

                        key={index}

                        className="mb-5 rounded-xl bg-[#111B33] p-5"

                    >

                        <h3 className="font-bold">

                            {item.type}

                        </h3>

                        <p className="mt-3">

                            Line {item.line}

                        </p>

                        <div className="mt-3">

                            <b>Original</b>

                            <p>{item.before}</p>

                        </div>

                        <div className="mt-3">

                            <b>Modified</b>

                            <p>{item.after}</p>

                        </div>

                        <div className="mt-3">

                            Severity

                            <b>

                                {" "}

                                {item.severity}

                            </b>

                        </div>

                    </div>

                ))

            }

        </div>

    );

}