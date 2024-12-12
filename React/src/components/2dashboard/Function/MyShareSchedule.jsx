import moment from "moment";
import { useEffect, useState } from "react";
import { Card, Carousel } from "react-bootstrap";
import { useSelector } from "react-redux";
import "../../../assets/css/2dashboard/function.css"
import style from '../../../assets/css/2dashboard/calendar.module.css'

const MyShareSchedule = ({ events }) => {
  return (
    <>
      <Card.Title className={style.title}>공유된 일정</Card.Title>
      <Card.Body></Card.Body>
    </>
  );
};
export default MyShareSchedule;
