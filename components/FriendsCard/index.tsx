import styled from 'styled-components';
import { PropsWithoutRef } from 'react';
import React, {useState, useCallback} from "react"
import dayjs from "dayjs";

export const Card = styled.div`
  max-width: 600px;
  width: 100%;
  background: rgba(0,0,0,0.01);
  box-shadow: 0px 0px 0px 0px rgba(0, 0, 0, 0);
  border: 2px solid rgba(0, 0, 0, 0.04);
  border-radius: 5px;
  transition: box-shadow .4s;
  &: hover {
      cursor: pointer;
    box-shadow: 4px 4px 8px 0px rgba(0, 0, 0, 0.2);
  }
`;

export const Container = styled.div`
  width: 100%;
  justify-content: center;
  display: flex;
`;

const Header = ({title, time}: PropsWithoutRef<{title: string, time: number}>) => {
    return (
      <div>
        <h2>{title}</h2>
        <p>{dayjs(time).format('YYYY年MM月DD日 hh:mm:ss')}</p>
      </div>
    );
}

const Content = ({body}: PropsWithoutRef<{body: string}>) => {
    return <span>{body}</span>
}

const Center = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
`

const ImagePreview = ({
  url,
  visitable,
  close,
}: PropsWithoutRef<{ url: string; visitable: boolean, close: (e: any) => void }>) => {
    console.log(visitable)
  return (
    <div
      style={{
        position: 'fixed',
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.4)',
        zIndex: 10001,
        display: visitable ? 'block' : 'none',
      }}
      onClick={close}
    >
      <Center>
        <img
          src={url}
          style={{ width: '80vw', height: '80vw', objectFit: 'cover' }}
        ></img>
      </Center>
    </div>
  );
};

const ImagesWall = ({ imgUrls }: PropsWithoutRef<{ imgUrls: string[] }>) => {
    const [previewVisitable, setPreviewVisitable] = useState(false);
    const [previewUrl, setPreviewUrl] = useState(imgUrls[0]);
    const openPreview = useCallback((url) => {
        setPreviewUrl(url);
        setPreviewVisitable(true);
    }, []);
  return (
    <div>
      <ImagePreview url={previewUrl} visitable={previewVisitable} close={(e: any) => {setPreviewVisitable(false)}}/>  
      {imgUrls.map((url) => (
        <img src={url} width="100px" height="100px" style={{objectFit: 'cover'}} onClick={() => openPreview(url)}></img>
      ))}
    </div>)
  ;
};


interface FriendsCardProps {
  title: string;
  time: number;
  body: string;
  imgUrls: string[];
}

export const FriendsCard = (props: PropsWithoutRef<FriendsCardProps>) => {
    const {
        title,
        time,
        body,
        imgUrls,
    } = props;
  return (
    <Container>
      <Card>
        <Header title={title} time={time} />
        <Content body={body} />
        <ImagesWall imgUrls={imgUrls} />
      </Card>
    </Container>
  );
};
