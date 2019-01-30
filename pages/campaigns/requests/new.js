import React, { Component } from "react";
import Layout from "../../../components/Layout";
import { Button, Form, Message, Input } from "semantic-ui-react";
import Campaign from "../../../ethereum/campaign";
import web3 from "../../../ethereum/web3";
import { Link, Router } from "../../../routes";

class NewRequest extends Component {
  static async getInitialProps(props) {
    return {
      address: props.query.address
    };
  }

  state = {
    value: "",
    description: "",
    recipient: "",
    errorMessage: "",
    loading: false
  };

  onSubmit = async event => {
    event.preventDefault();
    const campaign = Campaign(this.props.address);
    const { description, value, recipient } = this.state;

    this.setState({ loading: true, errorMessage: "" });

    try {
      //ether must be converted to wei when we submit to createRequest method.
      const wei = web3.utils.toWei(value, "ether");
      const accounts = await web3.eth.getAccounts();
      await campaign.methods
        .createRequest(description, wei, recipient)
        .send({ from: accounts[0] });
      //once request is created. send user back to page before.
      Router.pushRoute(`/campaigns/${this.props.address}/requests`);
    } catch (err) {
      this.setState({ errorMessage: err.message });
    }

    this.setState({ loading: false });
  };

  render() {
    return (
      <Layout>
        <Link route={`/campaigns/${this.props.address}/requests`}>
          <a>Back</a>
        </Link>
        <h3>Create a request!</h3>
        <Form onSubmit={this.onSubmit} error>
          <Form.Field>
            <label>Description</label>
            <input
              value={this.state.description}
              onChange={event =>
                this.setState({ description: event.target.value })
              }
            />
          </Form.Field>
          <Form.Field>
            <label>Value in ether</label>
            <input
              value={this.state.value}
              onChange={event => this.setState({ value: event.target.value })}
            />
          </Form.Field>
          <Form.Field>
            <label>Recipient</label>
            <input
              value={this.state.recipient}
              onChange={event =>
                this.setState({ recipient: event.target.value })
              }
            />
          </Form.Field>
          {this.state.errorMessage && (
            <Message error header="Oops!" content={this.state.errorMessage} />
          )}
          <Button primary loading={this.state.loading}>
            Create!
          </Button>
        </Form>
      </Layout>
    );
  }
}

export default NewRequest;
