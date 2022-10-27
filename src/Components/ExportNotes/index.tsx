//@ts-ignore
import * as FileSaver from "file-saver";
import { useEffect, useState } from "react";
import XLSX from "sheetjs-style";
import { IconButton, Tooltip } from "@chakra-ui/react";
import { BsDownload } from "react-icons/bs";

interface Notes {
  id: string;
  title: string;
  color: string;
  description: string;
  userId: string;
}

interface NavProps {
  notes: Array<Notes>;
}

export const ExportNotes = ({ notes }: NavProps) => {
  const [file, setFile] = useState<any>({});
  const fileType =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
  const fileExtension = ".xlsx";

  useEffect(() => {
    if (notes.length > 0) {
      setFile(
        notes.map((note: { title: string; description: string }) => {
          return {
            titulo: note.title,
            descricao: note.description,
          };
        })
      );
    } else {
      setFile([]);
    }
  }, [notes]);

  const handleDownload = () => {
    if (notes.length > 0) {
      const ws = XLSX.utils.json_to_sheet(file);
      const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
      const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
      const data = new Blob([excelBuffer], { type: fileType });
      FileSaver.saveAs(data, "NoteDay" + fileExtension);
    }
  };

  return (
    <Tooltip
      label="Clique para fazer Download de todas as suas notas"
      aria-label="A tooltip"
    >
      <IconButton
        onClick={handleDownload}
        disabled={notes.length > 0 ? false : true}
        icon={<BsDownload />}
        aria-label={""}
      />
    </Tooltip>
  );
};
