import React, { useEffect, useState } from "react";
import {
  Layout,
  Input,
  Row,
  Col,
  Card,
  Tag,
  Spin,
  Alert,
  Modal,
  Typography,
} from "antd";
import "antd/dist/antd.css";
import { addNewFavourite } from "./api/auth";
import { API_KEY } from "./config";
// const API_KEY = "ce762116"
const { Header, Content, Footer } = Layout;
const { Search } = Input;
const { Meta } = Card;
const TextTitle = Typography.Title;

const SearchBox = ({ searchHandler }) => {
  return (
    <Row>
      <Col span={12} offset={6}>
        <Search
          placeholder="enter movie, series, episode name"
          enterButton="Search"
          size="large"
          onSearch={(value) => searchHandler(value)}
        />
      </Col>
    </Row>
  );
};

const ColCardBox = ({
  Title,
  imdbID,
  Poster,
  Type,
  ShowDetail,
  DetailRequest,
  ActivateModal,
}) => {
  const clickHandler = () => {
    // Display Modal and Loading Icon
    ActivateModal(true);
    DetailRequest(true);

    fetch(`http://www.omdbapi.com/?i=${imdbID}&apikey=${API_KEY}`)
      .then((resp) => resp)
      .then((resp) => resp.json())
      .then((response) => {
        console.log(response);
        DetailRequest(false);
        ShowDetail(response);
      })
      .catch(({ message }) => {
        DetailRequest(false);
      });
  };

  return (
    <Col style={{ margin: "20px 0" }} className="gutter-row" span={4}>
      <div className="gutter-box">
        <Card
          style={{ width: 200 }}
          cover={
            <img
              alt={Title}
              src={
                Poster === "N/A"
                  ? "https://placehold.it/198x264&text=Image+Not+Found"
                  : Poster
              }
            />
          }
          onClick={() => clickHandler()}
        >
          <Meta title={Title} description={false} />
          <Row style={{ marginTop: "10px" }} className="gutter-row">
            <Col>
              <Tag color="magenta">{Type}</Tag>
            </Col>
          </Row>
        </Card>
      </div>
    </Col>
  );
};

const MovieDetail = ({
  Title,
  Poster,
  imdbRating,
  Rated,
  Runtime,
  Genre,
  Plot,
  imdbID,
  idtoken,
}) => {
  return (
    <Row>
      <Col span={11}>
        <img
          src={
            Poster === "N/A"
              ? "https://placehold.it/198x264&text=Image+Not+Found"
              : Poster
          }
          alt={Title}
        />
      </Col>
      <Col span={13}>
        <Row>
          <Col span={21}>
            <TextTitle level={4}>{Title}</TextTitle>
          </Col>
          <Col span={3} style={{ textAlign: "right" }}>
            <TextTitle level={4}>
              <span style={{ color: "#41A8F8" }}>{imdbRating}</span>
            </TextTitle>
          </Col>
        </Row>
        <Row style={{ marginBottom: "20px" }}>
          <Col>
            <Tag>{Rated}</Tag>
            <Tag>{Runtime}</Tag>
            <Tag>{Genre}</Tag>
          </Col>
        </Row>
        <Row>
          <Col>{Plot}</Col>
        </Row>
      </Col>
      <button
        className="btn btn-primary btn-sm"
        onClick={async (e) => {
          e.preventDefault();
          await addNewFavourite(idtoken.id, imdbID, idtoken.token);
          // console.log(imdbID, idtoken.id, idtoken.token);
        }}
      >
        Add to Favourite
      </button>
    </Row>
  );
};

const Loader = () => (
  <div style={{ margin: "20px 0", textAlign: "center" }}>
    <Spin />
  </div>
);

function Home(props) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [q, setQuery] = useState("batman");
  const [activateModal, setActivateModal] = useState(false);
  const [detail, setShowDetail] = useState(false);
  const [detailRequest, setDetailRequest] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(null);
    setData(null);
    console.log(props.idtoken);
    fetch(`http://www.omdbapi.com/?s=${q}&apikey=${API_KEY}`)
      .then((resp) => resp)
      .then((resp) => resp.json())
      .then((response) => {
        if (response.Response === "False") {
          setError(response.Error);
        } else {
          setData(response.Search);
        }

        setLoading(false);
      })
      .catch(({ message }) => {
        setError(message);
        setLoading(false);
      });
  }, [q]);

  return (
    <div className="App">
      <Layout className="layout">
        <Content style={{ padding: "0 50px" }}>
          <div style={{ background: "#fff", padding: 24, minHeight: 280 }}>
            <SearchBox searchHandler={setQuery} />
            <br />

            <Row gutter={16} type="flex" justify="center">
              {loading && <Loader />}

              {error !== null && (
                <div style={{ margin: "20px 0" }}>
                  <Alert message={error} type="error" />
                </div>
              )}

              {data !== null &&
                data.length > 0 &&
                data.map((result, index) => (
                  <ColCardBox
                    ShowDetail={setShowDetail}
                    DetailRequest={setDetailRequest}
                    ActivateModal={setActivateModal}
                    key={index}
                    {...result}
                  />
                ))}
            </Row>
          </div>
          <Modal
            title="Detail"
            centered
            visible={activateModal}
            onCancel={() => setActivateModal(false)}
            footer={null}
            width={800}
          >
            {detailRequest === false ? (
              <MovieDetail {...detail} idtoken={props.idtoken} />
            ) : (
              <Loader />
            )}
            {/* <div>asdf</div> */}
          </Modal>
        </Content>
      </Layout>
    </div>
  );
}

export default Home;
