import "./BorrowingInfo.css"
import Header from "../../WebComponents/Header/Header";
import { ConfigurableRouteNavigationBTNoFill } from "../../WebComponents/RoutingButtonCreation/ConfigurableRouteNavigationButton";
import { useNavigate } from "react-router";
import { useLocation } from "react-router";
import { useState    } from "react";
import { useEffect } from "react";

function BorrowingInfo() {
    const navigate = useNavigate();
    const navigateToAddBookInfoPage = (value) => {
        navigate("/Info",{state:{isbn:value}})};

    const [borrowing, setBorrowing] = useState({});

    useEffect(()=>{
      async function getBorrowingData() {
        const getBorrowingInfoAPI = 'http://localhost:8082/borrowing/getInfo?borrowingId=1';
        try {
            const response = await fetch(getBorrowingInfoAPI); 
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const borrowingDataJson = await response.json();

            const authors = borrowingDataJson.physicalBookCopy.physicalBook.book.authors;
            const authorNames = authors.map(author=>(author.name));

            const data = {
                isbn: borrowingDataJson.physicalBookCopy.physicalBook.book.isbn,
                status: borrowingDataJson.borrowingStatus.borrowingStatusType,
                title: borrowingDataJson.physicalBookCopy.physicalBook.book.title,
                author: authorNames.join(", "),
                copyNr: borrowingDataJson.physicalBookCopy.copyId,
                startDate: borrowingDataJson.startDate.slice(0,10),
                endDate: borrowingDataJson.returnDate.slice(0,10)
            };
            setBorrowing(data);
        } catch (error) {
            console.error('Error fetching catalog data:', error);
        };};
      
        getBorrowingData();
      },[]  
    );
    const location = useLocation();

   
        
    function navigationRowButtons(status, isbn){
        if (status=="uitgeleend") {
            return(
                <div className="navigationRowButtons">
                    <button className="darkButton" onClick={()=>(navigateToAddBookInfoPage(borrowing.isbn))}>Boek informatie</button>
                    <button className="darkButton">Inleveren</button>
                </div>
            )   
        } else {
            return( 
            <div className="navigationRowButtons">
                <button className="darkButton" onClick={()=>(navigateToAddBookInfoPage(borrowing.isbn))}>Boek informatie</button>
            </div>
        )}
    }

    function borrowingStatusRow(status, startDate, endDate){
        if (status=="uitgeleend") {
            return(
                <div className="tableRow thinBorder">
                    <p className="noMargin">Status: <strong>geleend</strong>&emsp;Geleend sinds: {startDate}</p>
                </div>
            );
        } else {
            return(
                <div className="tableRow thinBorder">
                    <p className="noMargin">Status: <strong>ingeleverd</strong>&emsp;Geleend op: {startDate}&emsp;Teruggebracht op: {endDate}</p>
                </div>
            );
        }

    }

    

    return (
        <div className="BorrowingInfo">
            <div className="header">
                <Header/>
            </div>
            <div className="content">
                <div className="navigationRow flexRow">
                    <div className="catalogReturn" align="left">
                        <ConfigurableRouteNavigationBTNoFill route={"/Catalogus"} text={"terug naar catalogus"} />
                    </div>
                    {navigationRowButtons(borrowing.status, borrowing.isbn)}
                </div>
                <div className="BorrowingItemTable mediumBorder">
                    <div className="tableHeader tableRow">
                        <p>{borrowing.title}, {borrowing.author}</p>
                    </div>
                    <div className="tableRow thinBorder">
                        <p className="noMargin">Exemplaar #{borrowing.copyNr}</p>
                    </div>
                    {borrowingStatusRow(borrowing.status, borrowing.startDate, borrowing.endDate)}
                    <div className="tableRow thinBorder noMargin noteRow">
                        <p className="noMargin">Notities: <br></br>Neem contact op met de trainers voor meer infomatie over het ophalen, opsturen en inleveren van geleende boeken</p>
                    </div>
                </div>
            </div>
            <div />
        </div>     
);}

export default BorrowingInfo