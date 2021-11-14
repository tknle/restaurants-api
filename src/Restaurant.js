import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Card, CardDeck } from "react-bootstrap";
import { MapContainer, TileLayer, Marker } from "react-leaflet";

export default function Restaurant() {

  let { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    let urls = `https://shrouded-spire-17040.herokuapp.com/api/restaurants/${id}`;

    fetch(urls)
    .then((res) => {
      if (!res) {
        throw new Error("Unable to find restaurant details");
      }
      return res.json();
    })
    .then((result) => {
      if (result.hasOwnProperty("_id")) {
        setRestaurant(result);
      } else {
        setRestaurant(null);
      }
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      setLoading(false);
    });
}, [id]);

  if (loading)   return <h1>Loading Restaurant Data...</h1>;
  else{
    if (restaurant) {
        return (
          <div>
            <div class="card">
       <div class="card-header">
       <strong>{restaurant.name}</strong>
        </div>
        <div class="card-body">
        <p class="card-text">{restaurant.address.building} {restaurant.address.street}</p>
        </div>
        </div>
       <br/>
            <MapContainer style={{ height: "400px" }} center={[restaurant.address.coord[1], restaurant.address.coord[0]]} zoom={13} scrollWheelZoom={false}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <Marker position={[restaurant.address.coord[1], restaurant.address.coord[0], ]} ></Marker>
            </MapContainer>
        <br/>
        <h3>Ratings</h3>
            <CardDeck>
              {restaurant.grades.map((element, i) => (
                <Card key={i} style={{ flex: "auto" }}>
                  <Card.Header className="bg-light">
                    <Card.Title>Grade: {element.grade}</Card.Title>
                  </Card.Header>
                  <Card.Body>
                    <Card.Text>Date: {element.date.toString()}</Card.Text>
                  </Card.Body>
                </Card>
              ))}
            </CardDeck>
            <br/><br/>
          </div>
        );    
    } else {
        return <h1>Unable to find resturant with id: {id}</h1>;
    }
  }
   
}
