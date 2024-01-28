"use client";
import Image from "next/image";
import styles from "./page.module.css";
import {
  Checkbox,
  FormControlLabel,
  Input,
  List,
  ListItem,
  Stack,
} from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";

export default function Home() {
  const [checkOneSide, setCheckOneSide] = useState(false);
  const [flyList, setFlyList] = useState([]);
  const [airportList, setAirportList] = useState([]);
  const [searchTermKalkis, setSearchTermKalkis] = useState("");
  const [searchTermVaris, setSearchTermVaris] = useState("");
  const [selectedAirportGidis, setSelectedAirportGidis] = useState("");
  const [selectedAirportDonus, setSelectedAirportDonus] = useState("");
  const [filteredAirports, setFilteredAirports] = useState([]);
  const [isDropdownOpenGidis, setIsDropdownOpenGidis] = useState(false);
  const [isDropdownOpenDonus, setIsDropdownOpenDonus] = useState(false);

  const handleCheckboxChange = () => {
    setCheckOneSide(!checkOneSide);
  };

  const handleFetch = async () => {
    try {
      // Uçuş verilerini çekme
      const flyResponse = await fetch(
        "https://65ab9c6efcd1c9dcffc6a945.mockapi.io/flies"
      );
      const flyData = await flyResponse.json();
      setFlyList(flyData);
      console.log("Uçuş Verileri:", flyData);
    } catch (flyError) {
      console.error("Uçuş Verileri Çekme Hatası:", flyError);
    }

    try {
      // Havaalanı verilerini çekme
      const airportResponse = await fetch(
        "https://65ab9c6efcd1c9dcffc6a945.mockapi.io/airport"
      );
      const airportData = await airportResponse.json();
      setAirportList(airportData);
      setFilteredAirports(airportData); // Başlangıçta tüm verileri göster
      console.log("Havaalanı Verileri:", airportData);
    } catch (airportError) {
      console.error("Havaalanı Verileri Çekme Hatası:", airportError);
    }
  };

  useEffect(() => {
    handleFetch();
  }, []);

  useEffect(() => {
    const filtered = airportList.filter(
      (airport) =>
        airport.name.toLowerCase().includes(searchTermKalkis.toLowerCase()) ||
        airport.city.toLowerCase().includes(searchTermKalkis.toLowerCase()) ||
        airport.code.toLowerCase().includes(searchTermKalkis.toLowerCase())
    );
    setFilteredAirports(filtered);
  }, [searchTermKalkis, searchTermVaris, airportList]);

  const handleAirportGidisClick = (selectedAirport) => {
    setSelectedAirportGidis(selectedAirport);
    closeDropdown();
  };
  const handleAirportClick = (selectedAirport) => {
    setSelectedAirportDonus(selectedAirport);
    closeDropdown();
  };

  const closeDropdown = () => {
    setIsDropdownOpenDonus(false);
    setIsDropdownOpenGidis(false);
  };

  console.log(selectedAirportDonus, selectedAirportGidis);

  return (
    <main className={styles.main}>
      <div className={styles.header}>
        <p>Travel Agent</p>
        <p className={styles.subTitle}>
          Lütfen Kalkış ve Varış Havaalanını seçiniz.
        </p>
        <FormControlLabel
          sx={{ color: "#FFFF", fontWeight: 600, fontSize: "1.5 rem" }}
          control={
            <Checkbox
              defaultChecked
              checked={checkOneSide}
              onChange={handleCheckboxChange}
            />
          }
          label="Tek yönlü uçuş"
        />
      </div>
      <div className={styles.description}>
        <div className={styles.airportContainer}>
          <p>Kalkış havaalanı</p>
          <div className={styles.inputContainer}>
            <input
              className={styles.input}
              type="text"
              placeholder="Havaalanı ara..."
              value={searchTermKalkis || selectedAirportGidis.name}
              onFocus={() => setIsDropdownOpenGidis(true)}
              onChange={(e) => setSearchTermKalkis(e.target.value)}
            />
            <FontAwesomeIcon icon={faSearch} className={styles.icon} />
            {isDropdownOpenGidis && (
              <List
                p="5px 20px"
                bgcolor="#ffff"
                boxShadow=""
                className={styles.dropdownList}
              >
                {filteredAirports.map((airport) => (
                  <ListItem
                    key={airport.code}
                    className={styles.dropdownItem}
                    onClick={() => handleAirportGidisClick(airport)}
                  >
                    {airport.name} - {airport.code}
                  </ListItem>
                ))}
              </List>
            )}
          </div>
        </div>
        <div className={styles.airportContainer}>
          <p>Varış Havaalanı</p>
          <div className={styles.inputContainer}>
            <input
              className={styles.input}
              type="text"
              placeholder="Havaalanı ara..."
              value={searchTermVaris || selectedAirportDonus.name}
              onFocus={() => setIsDropdownOpenDonus(true)}
              onChange={(e) => setSearchTermVaris(e.target.value)}
            />
            <FontAwesomeIcon icon={faSearch} className={styles.icon} />
            {isDropdownOpenDonus && (
              <ul className={styles.dropdownList}>
                {filteredAirports.map((airport) => (
                  <Stack
                    key={airport.id}
                    p="5px 20px"
                    bgcolor="#ffff"
                    boxShadow=""
                  >
                    <li
                      className={styles.dropdownItem}
                      onClick={() => handleAirportClick(airport)}
                    >
                      {airport.name} - {airport.code}
                    </li>
                  </Stack>
                ))}
              </ul>
            )}
          </div>
        </div>
        <div className={styles.airportContainer}>
          <p>Gidiş Tarihi</p>
          <div className={styles.inputContainer}>
            <input
              className={styles.dateInput}
              type="date"
              placeholder="Gidiş Tarihi"
            />
          </div>
        </div>
        <div className={styles.airportContainer}>
          <p>Dönüş Tarihi</p>
          <div className={styles.inputContainer}>
            <input
              className={styles.dateInput}
              disabled={checkOneSide}
              type="date"
              placeholder="Dönüş Tarihi"
            />
          </div>
        </div>
      </div>

      <div className={styles.center}></div>

      <div className={styles.grid}></div>
    </main>
  );
}
