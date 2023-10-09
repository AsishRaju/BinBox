import { Container, SimpleGrid } from "@mantine/core";
import { FilesList } from "../../Components/FilesList/FilesList";
import { UploadComponent } from "../../Components/UploadComponents/UploadComponent";
import { Header } from "../../Components/Header/Header";
import { useEffect, useState } from "react";
import { getFilesList } from "../../services/api";
import useAuthData from "../../zustandStore/useAuthData";

export function User() {
  const { user } = useAuthData();

  const [filesList, setFilesList] = useState([]);
  const [listLoading, setListLoading] = useState(false);

  const fileUploadedSignal = async () => {
    setListLoading(true);
    const fileList = await getFilesList(user.id);
    setFilesList(fileList);
    setListLoading(false);
  };

  useEffect(() => {
    fileUploadedSignal();
  }, []);

  return (
    <>
      <Header></Header>
      <Container>
        <SimpleGrid cols={1}>
          <div>
            <UploadComponent fileUploadedSignal={fileUploadedSignal} />
          </div>
          <div>
            <FilesList list={filesList} listLoading={listLoading} setListLoading={setListLoading} fileUploadedSignal={fileUploadedSignal} />
          </div>
        </SimpleGrid>
      </Container>
    </>
  );
}
