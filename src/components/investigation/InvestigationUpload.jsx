import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Search } from "lucide-react";

export default function InvestigationUpload({ onFile }) {

  const onDrop = useCallback((acceptedFiles) => {

    if (acceptedFiles.length > 0) {

      onFile(acceptedFiles[0]);

    }

  }, [onFile]);

  const {

    getRootProps,

    getInputProps,

    isDragActive,

  } = useDropzone({

    onDrop,

    multiple: false,

    accept: {

      "application/pdf": [".pdf"],

    },

  });

  return (

    <div

      {...getRootProps()}

      className={`
        border-2
        border-dashed
        rounded-2xl
        h-72
        flex
        flex-col
        justify-center
        items-center
        cursor-pointer
        transition-all

        ${
          isDragActive
            ? "border-green-400 bg-green-400/10"
            : "border-slate-700 hover:border-green-400"
        }

      `}

    >

      <input {...getInputProps()} />

      <Search
        size={70}
        className="text-green-400 mb-6"
      />

      <h2 className="text-2xl font-bold">

        Drop Leaked PDF

      </h2>

      <p className="text-slate-400 mt-3">

        or click to browse

      </p>

    </div>

  );

}