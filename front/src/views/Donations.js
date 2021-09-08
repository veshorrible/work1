import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import axios from 'axios';
import styled from 'styled-components';
import {
    Grid,
    CircularProgress,
} from '@material-ui/core';
let base64 = require('base-64');

const donorHeader = {
    "background" : "#29293d",
    "text-align": "center",
    "padding" : "20px",
    "font-weight": "bold",
    "color": "#ffffff"
}

const donorItem = {
    "background" : "#e0e0eb",
    "padding" : "10px"
}

const donorItem1 = {
    "background" : "#b3b3cc",
    "padding" : "10px"
}

const Input = styled.input`
  font-size: 22px;
  padding: 0 5px;
  background: "$b3b3cc";
`;

class Donations extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            donations: [],
            sum: null,
            donor_id: null,
            donor_name: '',
            donor_email: '',
            donor_gender: '',
            donation_amount: '',
            successImportedCount: null,
            errorImportedCount: null,
            totalImportedCount: null,
            uploadingCsvFile: false,
            loaded: false,
        };
    }

    fetchDonations() {
        this.setState({loaded: false});
        let params = {}
        if (this.state.donor_id != null) {
            params.donor_id = this.state.donor_id;
        }
        if (this.state.donor_name != '') {
            params.donor_name = this.state.donor_name;
        }
        if (this.state.donor_email != '') {
            params.donor_email = this.state.donor_email;
        }
        if (this.state.donor_gender != '') {
            params.donor_gender = this.state.donor_gender;
        }
        if (this.state.donor_address != '') {
            params.donor_address = this.state.donor_address;
        }
        if (this.state.donation_amount != '') {
            params.donation_amount = this.state.donation_amount;
        }
        axios.get(`http://localhost:3333/donations`, {
                auth: {
                    username: 'test',
                    password: 'test'
                },
                params
            }
        )
        .then(res => {
            const donations = res.data;
            this.setState({donations});
            this.setState({sum: Math.round(donations.reduce((a,v) =>  a = a + v.donation_amount , 0 ))});
            this.setState({loaded: true})

        })
        .catch(err => {
            console.log('ERR', err);
        });
    }

    componentDidMount() {
        this.fetchDonations();
    }

    isEven(n) {
        return n % 2 == 0;
    }

    handleFilter(value, type) {
        if (type == 'donor_name' && value == '**Anonymous**') {
            value = 'anonymous';
        }
        this.setState({[type]: value});
    }

    handleSendRequest(e) {
        this.fetchDonations();
    }

    handleUploadCsv = (event) => {
        this.setState({uploadingCsvFile: true});
        let formData = new FormData();
        formData.append('file', event.target.files[0]);
        let headers = new Headers();
        headers.set('Authorization', 'Basic ' + base64.encode("test:test"));
        fetch('http://localhost:3333/api/upload-csv-file', {
            method:'POST',
            body: formData,
            headers: headers
        })
            .then(resp => resp.json())
            .then(result => {
                this.setState({
                    successImportedCount: result.success,
                    errorImportedCount: result.error,
                    totalImportedCount: result.total
                });
                this.setState({uploadingCsvFile: false});
            })
    }

    render() {
        return (
            <div>
                {this.state.donations &&
                    <>
                        <Grid container>
                            <Grid item sm={7} xs={7}>
                                <Grid container>
                                    <Grid item sm={6} xs={6}>
                                        Upload your CSV file
                                        <Input
                                            type="file"
                                            ref={(input) => {
                                                this.filesInput = input
                                            }}
                                            name="file"
                                            icon='file'
                                            iconPosition='left'
                                            label='Upload CSV'
                                            labelPosition='right'
                                            placeholder='UploadCSV...'
                                            onChange={this.handleUploadCsv}
                                        />

                                    </Grid>
                                    <Grid item sm={6} xs={6}>
                                        <Grid container>
                                            <Grid item sm={12} xs={12}>
                                                {this.state.uploadingCsvFile && <CircularProgress/>}
                                            </Grid>
                                            <Grid item sm={12} xs={12}>
                                                Notification Area:
                                            </Grid>
                                            {this.state.successImportedCount &&
                                                <>
                                                    <Grid item sm={12} xs={12}>
                                                        Success Imported Count = {this.state.successImportedCount} records
                                                    </Grid>
                                                    <Grid item sm={12} xs={12}>
                                                        Error Imported Count = {this.state.errorImportedCount} records
                                                    </Grid>
                                                    <Grid item sm={12} xs={12}>
                                                        Total Imported Count = {this.state.totalImportedCount} records
                                                    </Grid>
                                                </>
                                            }
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item sm={5} xs={5} style={{padding: "20px", background: "#e0e0eb"}}>
                                Total donation amount - {this.state.sum}
                            </Grid>
                        </Grid>
                        <Grid container style={donorHeader}>
                            <Grid item sm={2} xs={2}>ID</Grid>
                            <Grid item sm={2} xs={2}>Name</Grid>
                            <Grid item sm={2} xs={2}>E-mail</Grid>
                            <Grid item sm={2} xs={2}>Gender</Grid>
                            <Grid item sm={2} xs={2}>Address</Grid>
                            <Grid item sm={2} xs={2}>Amount</Grid>
                        </Grid>


                        <Grid container>
                            <Grid item sm={2} xs={2}>
                                <Input
                                    label='ID'
                                    fullWidth
                                    name='donor_id'
                                    type='text'
                                    onChange={e => this.handleFilter(e.target.value, 'donor_id')}
                                    onBlur={e => this.handleSendRequest()}
                                    value={this.state.donor_id}
                                />
                            </Grid>
                            <Grid item sm={2} xs={2}>
                                <Input
                                    label='Name'
                                    fullWidth
                                    name='donor_name'
                                    type='text'
                                    onChange={e => this.handleFilter(e.target.value, 'donor_name')}
                                    onBlur={e => this.handleSendRequest()}
                                    value={this.state.donor_name}
                                />
                            </Grid>
                            <Grid item sm={2} xs={2}>
                                <Input
                                    label='E-mail'
                                    fullWidth
                                    name='donor_email'
                                    type='text'
                                    onChange={e => this.handleFilter(e.target.value, 'donor_email')}
                                    onBlur={e => this.handleSendRequest()}
                                    value={this.state.donor_email}
                                />
                            </Grid>
                            <Grid item sm={2} xs={2}>
                                <Input
                                    label='Gender'
                                    fullWidth
                                    name='donor_gender'
                                    type='text'
                                    onChange={e => this.handleFilter(e.target.value, 'donor_gender')}
                                    onBlur={e => this.handleSendRequest()}
                                    value={this.state.donor_gender}
                                />
                            </Grid>
                            <Grid item sm={2} xs={2}>
                                <Input
                                    label='Address'
                                    fullWidth
                                    name='donor_address'
                                    type='text'
                                    onChange={e => this.handleFilter(e.target.value, 'donor_address')}
                                    onBlur={e => this.handleSendRequest()}
                                    value={this.state.donor_address}
                                />
                            </Grid>
                            <Grid item sm={2} xs={2}>
                                <Input
                                    label='Amount'
                                    fullWidth
                                    name='donation_amount'
                                    type='text'
                                    onChange={e => this.handleFilter(e.target.value, 'donation_amount')}
                                    onBlur={e => this.handleSendRequest()}
                                    value={this.state.donation_amount}
                                />
                            </Grid>
                        </Grid>
                        {!this.state.loaded && <CircularProgress/>}
                        {this.state.loaded &&
                        this.state.donations.map((donation, key) => (
                            <Grid container>
                                <Grid item sm={2} xs={2}
                                      style={(this.isEven(key)) ? donorItem : donorItem1}>{donation.donor_id}</Grid>
                                <Grid item sm={2} xs={2}
                                      style={(this.isEven(key)) ? donorItem : donorItem1}>{donation.donor_name}</Grid>
                                <Grid item sm={2} xs={2}
                                      style={(this.isEven(key)) ? donorItem : donorItem1}>{donation.donor_email}</Grid>
                                <Grid item sm={2} xs={2}
                                      style={(this.isEven(key)) ? donorItem : donorItem1}>{donation.donor_gender}</Grid>
                                <Grid item sm={2} xs={2}
                                      style={(this.isEven(key)) ? donorItem : donorItem1}>{donation.donor_address}</Grid>
                                <Grid item sm={2} xs={2}
                                      style={(this.isEven(key)) ? donorItem : donorItem1}>{donation.donation_amount}</Grid>
                            </Grid>
                        ))
                        }
                    </>
                }
            </div>
        );
    }
}

export default withStyles({})(Donations);
