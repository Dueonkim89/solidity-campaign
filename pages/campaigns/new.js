import React, { Component } from "react";
import { Form, Button, Input, Message } from "semantic-ui-react";
import Layout from "../../components/Layout";
//deployed factory contract
import deployedFactory from "../../ethereum/factory";
//web 3 with infura or metamask
import web3 from "../../ethereum/web3";

class CampaignNew extends Component {
  state = {
    minimumContribution: "",
    errorMessage: "",
    loading: false
  };

  //arrow function for ease of 'this' binding
  onSubmit = async event => {
    this.setState({ loading: true, errorMessage: "" });
    console.log("in cb");
    event.preventDefault();

    try {
      //get list of accounts
      const accounts = await web3.eth.getAccounts();
      await deployedFactory.methods
        .createCampaign(this.state.minimumContribution)
        .send({
          //gas amount will be estimated by metamask. gas is only required when testing
          //provide address from where this is being invoked.
          from: accounts[0]
        });
      t;
    } catch (err) {
      this.setState({ errorMessage: err.message });
    }
    this.setState({ loading: false });
  };

  render() {
    console.log(this.state.minimumContribution);
    return (
      <Layout>
        <h3>Create a Campaign</h3>
        <Form onSubmit={this.onSubmit} error>
          <Form.Field>
            <label>Minimum Contribution</label>
            <Input
              label="wei"
              labelPosition="right"
              placeholder="Enter atleast minimum contribution"
              value={this.state.minimumContribution}
              onChange={event =>
                this.setState({ minimumContribution: event.target.value })
              }
            />
          </Form.Field>
          {this.state.errorMessage && (
            <Message error header="Oops!" content={this.state.errorMessage} />
          )}
          <Button loading={this.state.loading} primary>
            Create!
          </Button>
        </Form>
      </Layout>
    );
  }
}

export default CampaignNew;
