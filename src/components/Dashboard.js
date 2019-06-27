import React, {useState, useEffect} from 'react';
import {getAllPortfolioTransactions} from '../api';
import {Table, Button, message} from 'antd';
import moment from 'moment';
import {uploadPhoto} from '../api';


import AddTransaction from './AddTransaction';

const Dashboard = ({walletAddress, wallet}) => {
    const [portfolioTransactions, setPortfolioTransactions] = useState([]);
    const [addTransactionVisible, setAddTransactionVisible] = useState(false);

    let uploadFileRef = React.createRef();

    const onUpload = info => {
        const input = uploadFileRef.current;
        input.value = null;
        input.onchange = () => {
            console.log(uploadFileRef.current.files);

            const filereader = new FileReader();
            filereader.addEventListener('loadend', async event => {
                try {
                    console.log(event.target.result);
                    const result = await uploadPhoto(event.target.result, wallet);
                    console.log(result);
                } catch (e) {
                    console.log(e);
                }
            });

            filereader.readAsDataURL(uploadFileRef.current.files[0]);

        };

        input.accept = "image/*";
        input.click();

    };

    useEffect(() => {
        getAllPortfolioTransactions(walletAddress).then(setPortfolioTransactions);
    }, [walletAddress]);

    return (
        <div>
            <Button
                onClick={() => onUpload()}
                type="file"
                size="large"
            >
                Upload photo
            </Button>

            <input type="file" ref={uploadFileRef} style={{display: 'none'}}/>

            {portfolioTransactions.length ? (
                <p>
                    {portfolioTransactions.map((item, index) => {
                        console.log(item, index);
                        return <img key={index} src={item} alt="User" style={{width: '300px'}}/>
                    })}
                </p>


            ) : (
                <div>
                    <p>Your photos will appear here.</p>
                    <p>
                        If you have added a photo recently, please wait some time for
                        it to reflect on the blockchain.
                    </p>
                </div>
            )}

            <AddTransaction
                visible={addTransactionVisible}
                closeModal={() => {
                    setAddTransactionVisible(false);
                }}
                wallet={wallet}
            />
        </div>
    );
};

export default Dashboard;
