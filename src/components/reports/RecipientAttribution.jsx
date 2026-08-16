export default function RecipientAttribution({

    attribution,

}){

    return(

        <div className="rounded-2xl border border-slate-700 bg-[#16213A] p-6">

            <h2 className="text-2xl font-bold">

                Recipient Attribution

            </h2>

            <div className="mt-5 space-y-3">

                <p>

                    Recipient

                    <b>

                        {" "}

                        {attribution.recipient}

                    </b>

                </p>

                <p>

                    Confidence

                    <b>

                        {" "}

                        {attribution.confidence}%

                    </b>

                </p>

                <p>

                    Tracker

                    <b>

                        {" "}

                        {attribution.trackerId}

                    </b>

                </p>

            </div>

        </div>

    );

}