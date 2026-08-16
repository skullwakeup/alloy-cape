export default function ChainOfCustody({

    events,

}){

    return(

        <div className="rounded-2xl border border-slate-700 bg-[#16213A] p-6">

            <h2 className="mb-6 text-2xl font-bold">

                Chain of Custody

            </h2>

            {

                events.map((event,index)=>(

                    <div

                        key={index}

                        className="mb-4 rounded-xl bg-[#111B33] p-4"

                    >

                        <div className="font-semibold">

                            {event.type}

                        </div>

                        <div className="text-slate-400">

                            {event.description}

                        </div>

                        <div className="text-xs text-slate-500">

                            {new Date(event.time).toLocaleString()}

                        </div>

                    </div>

                ))

            }

        </div>

    );

}