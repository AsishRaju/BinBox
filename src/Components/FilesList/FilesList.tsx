import { ActionIcon, Modal, Skeleton, Table, Text } from "@mantine/core";
import { IconDownload, IconStatusChange, IconTrash, IconX } from "@tabler/icons-react";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import { deleteEntry } from "../../services/api";
import { useState } from "react";
import fileDownload from "js-file-download";
import { UploadComponent } from "../UploadComponents/UploadComponent";
import axios from "axios";
import { toast } from "react-toastify";
dayjs.extend(localizedFormat);

interface Props {
  setListLoading: React.Dispatch<React.SetStateAction<boolean>>;
  listLoading: boolean;
  list: {
    id: string;
    userEmail: string;
    uploadedAt: string;
    lastUpdatedAt: string;
    fileName: string;
    fileDesc: string;
    filePath: string;
    name: string;
  }[];
  fileUploadedSignal: () => void;
}

export function FilesList({ list, fileUploadedSignal, listLoading, setListLoading }: Props) {
  const [updateModalOpened, setUpdateModalOpened] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState("");
  const [selectedFile, setSelectedFile] = useState({
    id: "",
    userEmail: "",
    uploadedAt: "",
    lastUpdatedAt: "",
    fileName: "",
    fileDesc: "",
    filePath: "",
    name: ""
  });

  const processDelete = async (fileKey: string, bbkey: string) => {
    // eslint-disable-next-line no-useless-catch
    try {
      setDeleteLoading(fileKey);
      await deleteEntry(fileKey, bbkey);
      setDeleteLoading("");
      toast.success(
        <Text fw={"700"} c={"green"}>
          File Deleted
        </Text>
      );
      fileUploadedSignal();
    } catch (error) {
      throw error;
    }
  };

  const processDownload = async (url: string, filename: string) => {
    axios
      .get(url, {
        responseType: "blob",
      })
      .then((res) => {
        fileDownload(res.data, filename);
      });
  };

  const onModalClose = () => {
    setUpdateModalOpened(false);
  };

  const rows = list.map((element) => (
    <Table.Tr key={element.id}>
      <Table.Td>
        <Skeleton visible={listLoading}>{element.name}</Skeleton>
      </Table.Td>
      <Table.Td>
        <Skeleton visible={listLoading}>{element.userEmail}</Skeleton>
      </Table.Td>
      <Table.Td>
        <Skeleton visible={listLoading}>{element.uploadedAt}</Skeleton>
      </Table.Td>
      <Table.Td>
        <Skeleton visible={listLoading}>{element.lastUpdatedAt}</Skeleton>
      </Table.Td>
      <Table.Td>
        <Skeleton visible={listLoading}>{element.fileName}</Skeleton>
      </Table.Td>
      <Table.Td>
        <Skeleton visible={listLoading}>{element.fileDesc}</Skeleton>
      </Table.Td>
      <Table.Td>
        <Skeleton visible={listLoading}>
          <ActionIcon
            variant="light"
            color="green"
            size="lg"
            aria-label="Downloads"
            onClick={() => {
              processDownload(`https://d2kp9bl0h6cfs5.cloudfront.net/${element.filePath}`, element.fileName);
            }}
          >
            <IconDownload style={{ width: "70%", height: "70%" }} stroke={1.5} />
          </ActionIcon>
        </Skeleton>
      </Table.Td>
      <Table.Td>
        <Skeleton visible={listLoading}>
          <ActionIcon
            variant="light"
            color="blue"
            size="lg"
            aria-label="Update"
            onClick={() => {
              setUpdateModalOpened(true);
              setSelectedFile(element);
            }}
          >
            <IconStatusChange style={{ width: "70%", height: "70%" }} stroke={1.5} />
          </ActionIcon>
        </Skeleton>
      </Table.Td>
      <Table.Td>
        <Skeleton visible={listLoading}>
          <ActionIcon
            loading={deleteLoading == element.filePath}
            variant="light"
            color="red"
            size="lg"
            aria-label="Delete"
            onClick={() => {
              processDelete(element.filePath, element.id);
            }}
          >
            <IconTrash style={{ width: "70%", height: "70%" }} stroke={1.5} />
          </ActionIcon>
        </Skeleton>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <>
      <Table highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Uploaded By</Table.Th>
            <Table.Th>Email</Table.Th>
            <Table.Th>Uploaded On</Table.Th>
            <Table.Th>Last Modified</Table.Th>
            <Table.Th>File Name</Table.Th>
            <Table.Th>File Description</Table.Th>
            <Table.Th></Table.Th>
            <Table.Th></Table.Th>
            <Table.Th></Table.Th>
          </Table.Tr>
        </Table.Thead>
        {list.length > 0 && <Table.Tbody>{rows}</Table.Tbody>}
      </Table>
      {list.length === 0 && (
        <>
          <Skeleton height={30} mt={6} radius="sm" />
          <Skeleton height={30} mt={6} radius="sm" />
        </>
      )}
      <Modal opened={updateModalOpened} onClose={onModalClose} centered>
        <UploadComponent
          fileUploadedSignal={fileUploadedSignal}
          isUpdate
          fileDescs={selectedFile.fileDesc}
          bbkey={selectedFile.id}
          close={onModalClose}
        />
      </Modal>
    </>
  );
}
