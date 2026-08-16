import Layout from "../components/Layout";
import UploadCard from "../components/forms/UploadCard";
import RecipientCard from "../components/forms/RecipientCard";
import ClassificationCard from "../components/forms/ClassificationCard";
import GenerateCard from "../components/forms/GenerateCard";
import PasswordRetrievalCard from "../components/forms/PasswordRetrievalCard";


export default function IssueDocument() {

  return (

    <Layout>

      <h1 className="text-4xl font-bold">
        Issue Protected Document
      </h1>

      <p className="mt-2 mb-8 text-slate-400">
        Generate unique fingerprinted copies for each recipient.
      </p>


      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

        <UploadCard />

        <RecipientCard />

      </div>


      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">

        <ClassificationCard />

        <GenerateCard />

      </div>


      <PasswordRetrievalCard />

    </Layout>

  );
}