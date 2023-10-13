import { Button, Group, LoadingOverlay, Paper, Text, Textarea, rem } from "@mantine/core";
import { IconUpload, IconPhoto, IconX, IconCross } from "@tabler/icons-react";
import {
  Dropzone,
  DropzoneProps,
  FileWithPath,
  IMAGE_MIME_TYPE,
  PDF_MIME_TYPE,
  MS_WORD_MIME_TYPE,
  MS_EXCEL_MIME_TYPE,
  MS_POWERPOINT_MIME_TYPE,
} from "@mantine/dropzone";
import { useState } from "react";
import { addFileToDB, fileUploadHandler, updateFileToDB } from "../../services/api";
import useAuthData from "../../zustandStore/useAuthData";
import { toast } from "react-toastify";

function formatBytes(bytes: number, decimals = 2) {
  if (!+bytes) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KiB", "MiB", "GiB", "TiB", "PiB", "EiB", "ZiB", "YiB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

interface Props {
  fileUploadedSignal: () => void;
  close?: () => void;
  isUpdate?: boolean;
  fileDescs?: string;
  bbkey?: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
export function UploadComponent({ fileUploadedSignal, isUpdate = false, fileDescs = "", bbkey = "", close = () => {} }: Props) {
  const { user } = useAuthData();
  const [fileAdded, setFileAdded] = useState(false);
  const [file, setFile] = useState<FileWithPath[]>([]);
  const [fileUploadLoading, setFileUploadLoading] = useState(false);
  const [fileDesc, setFileDesc] = useState(fileDescs);

  const processUpload = async () => {
    try {
      setFileUploadLoading(true);
      const fileUplaodResult = await fileUploadHandler(file[0], user.id);
      console.log(fileUplaodResult);
      let dbResponse;
      if (file[0]?.path && fileUplaodResult?.fileKey && fileUplaodResult?.fileName) {
        if (!isUpdate) {
          dbResponse = await addFileToDB(fileUplaodResult.fileKey, fileUplaodResult.fileName, fileDesc, user.id, user.email);
        } else {
          dbResponse = await updateFileToDB(fileUplaodResult.fileKey, bbkey, file[0].path, fileDesc);
        }
      }
      console.log(dbResponse);
      setFile([]);
      setFileDesc("");
      setFileAdded(false);
      setFileUploadLoading(false);
      toast.success(
        <Text fw={"700"} c={"green"}>
          File Uploaded
        </Text>
      );
      await fileUploadedSignal();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Paper shadow="lg" p="md" withBorder pos="relative">
      <LoadingOverlay visible={fileUploadLoading} overlayProps={{ radius: "sm", blur: 2 }} />
      {fileAdded ? (
        <Group justify="center" gap="xl" mih={220}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <Text size="lg" fw={500} ta={"center"}>
              Added {file[0].name}
            </Text>
            <Text size="lg" fw={500} c="dimmed" ta={"center"}>
              {formatBytes(file[0].size)}
            </Text>
            <Textarea placeholder="add description if any" mt="md" value={fileDesc} onChange={(event) => setFileDesc(event.target.value)} />
            <div>
              <Button m={"10px"} fw={700} size="md" variant="light" color="blue" rightSection={<IconUpload size={14} />} onClick={processUpload}>
                Upload
              </Button>
              <Button
                m={"10px"}
                fw={700}
                size="md"
                variant="light"
                color="red"
                rightSection={<IconX size={14} />}
                onClick={() => {
                  setFile([]);
                  setFileAdded(false);
                  if (isUpdate) {
                    close();
                  }
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        </Group>
      ) : (
        <Dropzone
          onDrop={(files) => {
            console.log("accepted files", files);
            setFileAdded(true);
            setFile(files);
          }}
          disabled={fileAdded}
          onReject={(files) => {
            console.log("rejected files", files)
            toast.error(
              <Text fw={"700"} c={"#e74c3c"}>
                File size greater than 10mb
              </Text>
            );
        }}
          maxSize={10 * 1024 ** 2}
          accept={[...IMAGE_MIME_TYPE, ...PDF_MIME_TYPE, ...MS_WORD_MIME_TYPE, ...MS_EXCEL_MIME_TYPE, ...MS_POWERPOINT_MIME_TYPE]}
        >
          <Group justify="center" gap="xl" mih={220} style={{ pointerEvents: "none" }}>
            <Dropzone.Accept>
              <IconUpload style={{ width: rem(52), height: rem(52), color: "var(--mantine-color-blue-6)" }} stroke={1.5} />
            </Dropzone.Accept>
            <Dropzone.Reject>
              <IconX style={{ width: rem(52), height: rem(52), color: "var(--mantine-color-red-6)" }} stroke={1.5} />
            </Dropzone.Reject>
            <Dropzone.Idle>
              <IconPhoto style={{ width: rem(52), height: rem(52), color: "var(--mantine-color-dimmed)" }} stroke={1.5} />
            </Dropzone.Idle>

            <div>
              <Text size="xl" inline ta="center">
                {isUpdate ? "Add updated file here" : "Drag images here or click to select files"}
              </Text>
              <Text size="sm" c="dimmed" inline mt={7} ta="center">
                Attach as many files as you like, each file should not exceed 10mb
              </Text>
            </div>
          </Group>
        </Dropzone>
      )}
    </Paper>
  );
}
