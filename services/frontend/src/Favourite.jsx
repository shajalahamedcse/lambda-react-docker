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
import { addNewFavourite, getFavourites } from "./api/auth";
import { API_KEY } from "./config";
import axios from "axios";
// const API_KEY = "ce762116"
const { Header, Content, Footer } = Layout;
const { Search } = Input;
const { Meta } = Card;
const TextTitle = Typography.Title;

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
      {/* <button
        className="btn btn-primary btn-sm"
        onClick={async (e) => {
          e.preventDefault();
          await addNewFavourite(idtoken.id, imdbID, idtoken.token);
          // console.log(imdbID, idtoken.id, idtoken.token);
        }}
      >
        Add to Favourite
      </button> */}
    </Row>
  );
};

const Loader = () => (
  <div style={{ margin: "20px 0", textAlign: "center" }}>
    <Spin />
  </div>
);

function Favourite(props) {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [q, setQuery] = useState("batman");
  const [activateModal, setActivateModal] = useState(false);
  const [detail, setShowDetail] = useState(false);
  const [detailRequest, setDetailRequest] = useState(false);
  const [fav, setFav] = useState([]);
  const { idtoken } = props;

  useEffect(() => {
    async function getFavList() {
      setLoading(true);
      console.log("Fetching favourites...");
      const get = await getFavourites(idtoken.id, idtoken.token);
      console.log("fav list: " + JSON.stringify(get));
      setFav(get);
      console.log("fav list: " + JSON.stringify(fav));

      setError(null);
      await get.map(async (result) => {
        console.log("fav item: " + result);
        // const response = await axios.get(
        //   `http://www.omdbapi.com/?i=${result}&apikey=${API_KEY}`
        // );
        const response = await axios.get(
          `http://www.omdbapi.com/?i=${result}&apikey=${API_KEY}`
        );


        console.log("movie details: " + JSON.stringify(response.data));

        setData((oldData) => [...oldData, response.data]);
        console.log(response.data);
      });
      setLoading(false);
    }

    setData([]);
    getFavList();

    setData((oldData) => oldData.sort());
  }, []);

  return (
    <div className="App">
      <Layout className="layout">
        <Content style={{ padding: "0 50px" }}>
          <div style={{ background: "#fff", padding: 24, minHeight: 280 }}>
            {/* <SearchBox searchHandler={setQuery} /> */}
            <br />

            <Row gutter={16} type="flex" justify="center">
              {loading && <Loader />}

              {error !== null && (
                <div style={{ margin: "20px 0" }}>
                  <Alert message={error} type="error" />
                </div>
              )}

              {data.map((result, index) => (
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
export default Favourite;
