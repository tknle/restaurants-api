import queryString from "query-string";
import { useState, useEffect } from "react";
import { Table, Pagination } from "react-bootstrap";
import { useLocation, useHistory } from "react-router-dom";

export default function Restaurants() {
  const [restaurants, setRestaurants] = useState(null);
  const [page, setPage] = useState(1);
  const history = useHistory();
  const [loading, setLoading] = useState(true);
  const perPage = 10;

  let location = useLocation();

  useEffect(() => {
    setLoading(true);
    let strObj = queryString.parse(location.search).borough;
    const allResUrl = `https://shrouded-spire-17040.herokuapp.com/api/restaurants?page=${page}&perPage=${perPage}`;
    const locResUrl = `https://shrouded-spire-17040.herokuapp.com/api/restaurants?page=${page}&perPage=${perPage}&borough=${strObj}`;
  
    fetch(strObj ? locResUrl : allResUrl)
    .then((res) => {
        return res.json();
      })
      .then((result) => {
        setRestaurants(result);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => setLoading(false));
  }, [page, location]);

  function previousPage() {
    if (page > 1) setPage((prev) => prev - 1);
  }

  function nextPage() {
    setPage((prev) => prev + 1);
  }

  if (loading || !restaurants) {
    return (
        <div class="card">
         <div class="card-body">  
         <p class="card-text">Loading Restaurants</p>
         </div>
     </div>
    );
    }
      if(restaurants.length === 0){
    return (
        <div class="card">
        <div class="card-body">  
        <p class="card-text">No Restaurants Found</p>
        </div>
    </div>
      );
    }

  if (!loading) {
    if (restaurants) {
      return (
        <div>
          <header>
            <h1>Restaurant List</h1>
            <p>Full list of restaurants. Optionally sorted by borough</p>
          </header>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Name</th>
                <th>Address Building + Street</th>
                <th>Borough</th>
                <th>Cuisine</th>
              </tr>
            </thead>
            <tbody>
              {restaurants.map((restaurant, index) => (
                <tr key={index} onClick={() => {history.push(`/Restaurant/${restaurant._id}`); }} >
                  <td>{restaurant.name}</td>
                  <td>{restaurant.address.building} {restaurant.address.street}</td>
                  <td>{restaurant.borough}</td>
                  <td>{restaurant.cuisine}</td>
                </tr>
              ))}
            </tbody>
          </Table>

          <Pagination>
            <Pagination.Prev onClick={previousPage} />
            <Pagination.Item>{page}</Pagination.Item>
            <Pagination.Next onClick={nextPage} />
          </Pagination>
        </div>
      );
    }
    }
}
