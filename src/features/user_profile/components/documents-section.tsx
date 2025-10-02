import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { BACKEND_IP } from "@/utils/endpoints";
import { Eye, FileText, PackageOpen, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import {
  useDeleteDocument,
  useGetDocuments,
  usePostDocument,
  usePutDocument,
} from "../hooks/use-document";
import type { IDocument, IDocumentsSectionProps } from "../utils/types";
import DocumentForm from "./documents-form";

const DocumentsSection = ({
  isCurrentUser,
  isLoading,
}: IDocumentsSectionProps & { isLoading?: boolean }) => {
  const [selectedDocument, setSelectedDocument] = useState<IDocument | null>(
    null
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // API hooks
  const { data: documentsData = [], isLoading: apiLoading } = useGetDocuments();
  const createDocumentMutation = usePostDocument();
  const updateDocumentMutation = usePutDocument();
  const deleteDocumentMutation = useDeleteDocument();

  const handleSubmit = (values: IDocument) => {
    if (selectedDocument) {
      // Update existing document
      updateDocumentMutation.mutate({
        id: selectedDocument.id,
        type: values.type,
        file_path: values.file_path,
        file_name: values.file_name,
      });
    } else {
      // Create new document
      createDocumentMutation.mutate({
        type: values.type,
        file_path: values.file_path || "",
        file_name: values.file_name,
      });
    }
    setIsDialogOpen(false);
    setSelectedDocument(null);
  };

  const handleDelete = (id: string) => {
    deleteDocumentMutation.mutate(id);
  };

  // const handleEdit = (document: IDocument) => {
  //   setSelectedDocument(document);
  //   setIsDialogOpen(true);
  // };

  const handleCancel = () => {
    setSelectedDocument(null);
    setIsDialogOpen(false);
  };

  if (isLoading || apiLoading) {
    return <DocumentsSkeleton isCurrentUser={isCurrentUser || false} />;
  }

  return (
    <Card className="border-muted-foreground/20">
      <CardHeader className="flex flex-row justify-between items-center pb-4 border-b">
        <div>
          <CardTitle className="text-xl">Documents</CardTitle>
          <CardDescription>Upload and manage your documents</CardDescription>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="flex justify-between items-center">
          <p className="font-medium text-lg">All Documents</p>
          {isCurrentUser && (
            <Button onClick={() => setIsDialogOpen(true)} size="sm">
              <Plus className="size-4" />
              Add Document
            </Button>
          )}
        </div>

        {documentsData && documentsData.length > 0 ? (
          <div className="space-y-4">
            {documentsData.map((document, index) => (
              <Card
                key={index}
                className="bg-muted border border-muted-foreground/20 overflow-hidden"
              >
                <CardContent className="p-6">
                  <div className="flex justify-between items-center gap-4">
                    <div className="flex items-center gap-4">
                      <div className="p-3 border rounded-lg">
                        <FileText className="size-4 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="max-w-[150px] sm:max-w-[200px] font-medium truncate">
                          {document.file_name ||
                            document?.file_path?.split("/").pop() ||
                            `Document ${index + 1}`}
                        </p>
                        <p className="text-muted-foreground text-xs">
                          {document.uploaded_at
                            ? new Date(
                                document.uploaded_at
                              ).toLocaleDateString()
                            : "No upload date"}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="icon">
                        <a
                          href={`${BACKEND_IP}${document.file_path}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center"
                        >
                          <Eye className="size-4" />
                        </a>
                      </Button>
                      {isCurrentUser && (
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => handleDelete(document.id)}
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="bg-muted py-6 border border-muted-foreground/20 rounded-lg text-center">
            <PackageOpen className="mx-auto mb-4 size-6 text-muted-foreground" />
            <p className="mb-4 text-muted-foreground">
              {isCurrentUser
                ? "No documents added yet. Upload documents to enhance your profile."
                : "This user has not added any documents yet."}
            </p>
          </div>
        )}
      </CardContent>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Add Document</DialogTitle>
            <DialogDescription>Upload your document</DialogDescription>
          </DialogHeader>

          <DocumentForm
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            initialValues={selectedDocument || undefined}
          />
        </DialogContent>
      </Dialog>
    </Card>
  );
};

const DocumentsSkeleton = ({ isCurrentUser }: { isCurrentUser: boolean }) => {
  return (
    <Card className="border-muted-foreground/20">
      <CardHeader className="flex flex-row justify-between items-center pb-4 border-b">
        <div>
          <CardTitle className="text-xl">Documents</CardTitle>
          <CardDescription>Loading document data...</CardDescription>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="w-32 h-7" />
          {isCurrentUser && <Skeleton className="w-28 h-9" />}
        </div>

        <div className="space-y-4">
          {[...Array(1)].map((_, index) => (
            <Card
              key={index}
              className="bg-muted border border-muted-foreground/20 overflow-hidden"
            >
              <CardContent className="p-6">
                <div className="flex flex-col justify-between items-center gap-4">
                  <div className="flex items-center gap-4">
                    <Skeleton className="p-3 border rounded-lg w-10 h-10" />
                    <div>
                      <Skeleton className="w-32 sm:w-48 h-6" />
                      <Skeleton className="mt-1 w-20 h-3" />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {isCurrentUser && <Skeleton className="w-9 h-9" />}
                    <Skeleton className="w-9 h-9" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default DocumentsSection;
