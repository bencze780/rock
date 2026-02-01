import React from 'react';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import "../styles/zenekarokLista.css"

const ZenekarokLista = () => {
    const [zenekarok, setZenekarok] = useState([]);
    const [stilusok, setStilusok] = useState([]);

    const handleDelete = async (id) => {
        if (window.confirm("Biztosan törölni szeretnéd ezt az együttest?")) {
            try {
                const response = await fetch(`http://localhost:3000/api/zenekar/${id}`, {
                    method: 'DELETE'
                });
                if (response.ok) {
                    setZenekarok(zenekarok.filter((zenekar) => zenekar.id !== id));
                }
            } catch (error) {
                console.error("Hiba a törlés során:", error);
            }
        }
    };

    useEffect(() => {
        const fetchZenekarok = async () => {
            try {
                const response = await fetch('http://localhost:3000/api/zenekar');
                const data = await response.json();
                setZenekarok(data);
            } catch (error) {
                console.error('Hiba történt a zenekarok lekérdezésekor:', error);
            }
        };

        const fetchStilusok = async () => {
            try {
                const response = await fetch('http://localhost:3000/api/stilusok');
                const data = await response.json();
                setStilusok(data);
            } catch (error) {
                console.error('Hiba történt a stílusok lekérdezésekor:', error);
            }
        };

        fetchZenekarok();
        fetchStilusok();
    }, []);
    return (
        <>
            <div className="row p-5">

            {zenekarok.map((zenekar) => (
                <div key={zenekar.id} className="col-12 offset-md-1 col-md-10 offset-lg-0 col-lg-6 ">
                <div className="card border-light mb-3">
                    <div className="card-header" style={{ backgroundColor: 'rgb(108, 82, 253)' }}>
                        <span className="fw-bold">{zenekar.nev}</span>
                        <span className="float-end">
                            {stilusok.find(stilus => stilus.id === zenekar.stilus_id)?.stilus_neve}
                        </span>
                    </div>
                    <div className="card-body">
                        <div className="card-text"> 
                            <p>Származási helye: {zenekar.orszag}</p>
                            <p>Aktív évek: {zenekar.aktiv_evek}</p>
                            <p>Tagok: {zenekar.tagok}</p>
                            <p>Legsikeresebb album: {zenekar.legsikeresebb_album}</p>
                           
                        </div>
                    </div>
                    <img className="card-img-bottom p-2 img-fluid" alt="" src={zenekar.kep_url}/>
                    <div className="card-footer text-center">
                        <button 
                            id={`gomb-${zenekar.id}`} 
                            className="btn btn-outline-secondary px-4" 
                            onClick={() => {
                                const currentYear = new Date().getFullYear();
                                const [startYear, endYear] = zenekar.aktiv_evek.split('–').map(year => 
                                    year.trim() === 'napjainkig' ? currentYear : parseInt(year)
                                );

                                if (!isNaN(startYear) && !isNaN(endYear)) {
                                    const activeYears = endYear - startYear;
                                    alert(`A ${zenekar.nev} ${activeYears} évig játszott együtt`);
                                } else {
                                    alert('Hibás formátum az aktív évek mezőben.');
                                }
                            }}
                        >
                            Aktív évek száma
                        </button>
                        <button 
                            className="btn btn-danger px-4 ms-2"
                            onClick={() => handleDelete(zenekar.id)}
                        >
                            Törlés
                        </button>
                    </div>
                </div>
            </div>
            ))}
            
 
        </div>
        </>
    );
};

export default ZenekarokLista;