import React, {useState, useEffect} from 'react';
import {getAllPortfolioTransactions} from '../api';
import {Button, Spin, Row, Col, Input} from 'antd';
import {uploadPhoto } from '../api';
import './Cards.css';
import AddTransaction from './AddTransaction';

const Dashboard = ({walletAddress, wallet}) => {
    const [portfolioTransactions, setPortfolioTransactions] = useState([]);
    const [addTransactionVisible, setAddTransactionVisible] = useState(false);
    const [textTitle, setTextTitle] = useState('');
    const [textIngredients, setTextIngredients] = useState('');
    const [textCooking, setTextCooking] = useState('');

    const statusNothing = 'nothing';
    const statusUploading = 'uploading';
    const statusUploaded = 'uploaded';

    let uploadFileRef = React.createRef();
    let [photoUploadingStatus, setStatus] = useState(statusNothing);

    const onUpload = info => {
        const input = uploadFileRef.current;
        input.value = null;
        input.onchange = () => {
            console.log(uploadFileRef.current.files);

       

        };

        input.accept = "image/*";
        input.click();

    };
    const SavetextTitle =(e)=> {
        setTextTitle(e.target.value)
    };
     const SavetextIngredients =(e)=> {
        setTextIngredients(e.target.value)
    };
     const SavetextCooking =(e)=> {
        setTextCooking(e.target.value)
    };
   

   
        
      

    
    const Save =()=> {
         const filereader = new FileReader();
            filereader.addEventListener('loadend', async event => {
                try {
                    setStatus(statusUploading);
                    console.log(event.target.result);
                    const result = await uploadPhoto(event.target.result,textTitle, textIngredients, textCooking, wallet);
                    setStatus(statusUploaded);
                    console.log(result);
                } catch (e) {
                    console.log(e);
                }
            });

            filereader.readAsDataURL(uploadFileRef.current.files[0]);
            setTextTitle('');
            setTextIngredients('');
            setTextCooking('');
        }

    useEffect(() => {
        getAllPortfolioTransactions(walletAddress).then(setPortfolioTransactions);
    }, [walletAddress]);

    return (
        <Row>
        <Col span={9} >
        <Col span={24} >
            <Button
                onClick={() => onUpload()}
                type="file"
                size="large"
            >
                Upload a photo of your recipe
            </Button>
            
        </Col>
           <Col span={24} >
            <h1>Title</h1>
            <Input type="text" value={textTitle} onChange={SavetextTitle} placeholder="Enter recipe name" />
            
            </Col>
            <Col span={24} >
            <h1>Ingredients</h1>
            <Input.TextArea type="text" value={textIngredients} onChange={SavetextIngredients}  style={{height: '100px'}}  />
            </Col>
            <Col span={24} >
            <h1>Cooking method</h1>
            <Input.TextArea type="text" value={textCooking} onChange={SavetextCooking} style={{height: '200px'}} />
            </Col>
           
            <Button
                onClick={() => Save()}
                type="file"
                size="large"
                style={{width: '80%', margin: '15px'}}
            >
                Save
            </Button>
            </Col>


            <Col span={15} >
            <input type="file" ref={uploadFileRef} style={{display: 'none'}} />

            {photoUploadingStatus === statusUploading ? <div>
                <p>Uploading recipe...</p>
                <Spin size="large"/>
            </div> : <span/>}
            {photoUploadingStatus === statusUploaded ?
                <div>
                    <p>Recipe uploaded! Sending your recipe to the perma-gallery... check back soon.</p>
                    <p>recipe will not be displayed until it has been mined into a block.</p>
                </div> : <span/>}

            {portfolioTransactions.length ?
                <div>
                  {portfolioTransactions.map((item, index) => {
                    const obj = JSON.parse(item)
   
                        console.log(obj);
                        return (
                            <Col span = {12} key={index} className="card">
                            <h2>{obj.text}</h2>
                            <img  src={obj.photo} alt="User" style={{width: '100%'}}/>
                            <div className="container">
                            <h4>{obj.text1}</h4>
                            <p>{obj.text2}</p>
                            </div>
                            </Col>
                            )
                       
                   })}
                </div>
                :
                <div>
                    <p>Your recipe will appear here.</p>
                    <p>
                        If you have added a recipe recently, please wait some time for
                        it to reflect on the blockchain.
                    </p>
                </div>
            }

            <AddTransaction
                visible={addTransactionVisible}
                closeModal={() => {
                    setAddTransactionVisible(false);
                }}
                wallet={wallet}
            />
            </Col>
        </Row>
    );
};

export default Dashboard;