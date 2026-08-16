import { createContext, useContext, useState, useEffect } from "react";
import { getDocuments } from "../services/document/documentSupabaseService";

const IssueContext = createContext();

export function IssueProvider({ children }) {

  const [document, setDocument] = useState(null);

  const [registry, setRegistry] = useState([]);

  async function loadRegistry() {
    try {
      const documents = await getDocuments();
      setRegistry(documents);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    loadRegistry();
  }, []);

  const [recipients, setRecipients] = useState([]);

  const [classification, setClassification] =
    useState("Confidential");

  const [generatedCopies, setGeneratedCopies] =
    useState([]);

  const [generationProgress, setGenerationProgress] =
    useState(0);

  const [generationStatus, setGenerationStatus] =
    useState("");

  // Global Search
  const [searchQuery, setSearchQuery] =
    useState("");

  const value = {

    document,
    setDocument,

    registry,
    setRegistry,
    loadRegistry,

    recipients,
    setRecipients,

    classification,
    setClassification,

    generatedCopies,
    setGeneratedCopies,

    generationProgress,
    setGenerationProgress,

    generationStatus,
    setGenerationStatus,

    searchQuery,
    setSearchQuery,

  };
  return (

    <IssueContext.Provider value={value}>

      {children}

    </IssueContext.Provider>

  );

}

export function useIssue() {
  return useContext(IssueContext);
}