import React, { useEffect, useState, setStatus } from "react";
import { useHistory, Link, NavLink } from "react-router-dom";
import { Navbar } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import Navigation from "./navigation";
import NavigationLogin from "./Navigation2";
import './search.css';
const axios = require('axios').default;

//import { keys } from "@material-ui/core/styles/createBreakpoints";


const MyRide = () => {
    const history = useHistory();
    const [ads, getAds] = useState([]);
    const getUser = async () => {
        try {
            const response = await fetch('/myRide', {
                method: "GET",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                },
                credentials: "include"
            });


            const data = await response.json();
            console.log("=============ads");
            console.log(data);
            getAds(data);

            if (!response.status === 200) {
                const error = new Error(response.error);
                throw error;
            }
        } catch (err) {
            console.log(err);
            history.push('/login');
        }
    }

    const upDateRide = (id) => {

        const newDeparture = ("Enter the New Orign");
        axios.put('/update',
            { id: id, newDeparture: newDeparture });

    };

    const deleteRide = async (id) => {
        fetch(`/delete/${id}`, {
            method: 'DELETE'
        }).then(() => {
            getUser(
                ads.filter((item) => {
                    return item._id !== id;
                })
            )
        })

    }
    useEffect(() => {
        getUser();
        deleteRide();
        //upDateRide();
    }, []);
    return (
        <div className="header">
            <NavigationLogin />

            <div className="container mt-5 ">
                <div className="row text-center">
                    {ads.map((element) =>
                        <div className="col-10 col-md-4 mt-5" key={element.id}>
                            <div className="trainer-card">
                                <div className="d-flex align-items-center">
                                    <div className="ml-3 w-100">
                                        <div className="trainer-card-photo"></div>
                                        <h4 className="trainer-name-title">{element.loginName}</h4>
                                        <div className="origin">
                                            <div><span>Origin:</span><span className="origin1">{element.departure}</span> </div>
                                            <div> <span>Destination</span> <span className="destination1">{element.destination}</span> </div>
                                        </div>
                                        <div className="origin">
                                            <div><span>Date:</span> <span className="origin1">{element.date}</span> </div>
                                            <div> <span>Time:</span> <span className="destination1">{element.time}</span> </div>
                                        </div>
                                        <div className="origin">
                                            <div> <span>Number:</span> <span className="origin1">{element.number}</span> </div>
                                            <div> <span>Car No:</span> <span className="destination1">{element.registration}</span> </div>
                                        </div>
                                        <div className="origin">
                                            <div> <span>Color</span> <span className="origin1">{element.color}</span> </div>
                                            <div> <span>Meetup Point:</span> <span className="destination1">{element.meetupPoint}</span> </div>
                                        </div>
                                        <div className="origin">
                                            <div> <span>Color</span> <span className="origin1">{element.charges}</span> </div>
                                        </div>
                                        <button className="button12" onClick={() => {
                                            upDateRide(element._id);
                                        }}>Edit</button>
                                        <button className="button1" onClick={() => {
                                            deleteRide(element._id);
                                        }}>Delete</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
export default MyRide;