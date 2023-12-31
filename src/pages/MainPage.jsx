import React, { useEffect, useState } from "react";
import { getAllCoins, getCoinPrices } from "../services/coin-service";
import AllCoinChart from "../components/AllCoinChart/AllCoinChart";
import TimeChart from "../components/TimeChart/TimeChart";

const MainPage = () => {
  const [loading, setLoading] = useState(true);

  const [allCoins, setAllCoins] = useState();
  const [requestAllCoins, setRequestAllCoins] = useState(0);

  const selectedCoins = ["bitcoin", "ethereum", "maker"];
  const [coinsPrice, setCoinsPrice] = useState();
  const [requestCoinPrice, setRequestCoinPrice] = useState(0);

  useEffect(() => {
    getAllCoins()
      .then((coins) => {
        setAllCoins(coins);
        setLoading(false);
      })
      .catch((err) => console.error("Error fetching allCoins:", err));
  }, [requestAllCoins]);

  useEffect(() => {
    const fetchCoinPrices = async () => {
      const updatedCoinsPrice = {};
      for (let i = 0; i < selectedCoins.length; i++) {
        try {
          const coinPrice = await getCoinPrices(selectedCoins[i].toLowerCase());
          updatedCoinsPrice[selectedCoins[i]] = coinPrice;
          setLoading(false);
        } catch (err) {
          console.error("Error fetching coinPrices:", err);
        }
      }
      setCoinsPrice(updatedCoinsPrice);
    };

    fetchCoinPrices();
  }, [requestCoinPrice]);

  const makeCoinTimeRequest = () => setRequestCoinPrice(requestCoinPrice + 1);

  // console.log(allCoins);

  // console.log(coinsPrice);

  return (
    <div>
      <h1>Graph for Crypto Coins</h1>
      <p >Data from coincap.io API</p>
      <hr />
      {loading || !allCoins ? (
        <p>Loading...</p>
      ) : (
        <AllCoinChart coins={allCoins} />
      )}
      <hr />
      {loading || !coinsPrice ? (
        <p>Loading...</p>
      ) : (
        <TimeChart
          coinsPrice={coinsPrice}
          makeCoinTimeRequest={makeCoinTimeRequest}
        />
      )}
    </div>
  );
};

export default MainPage;