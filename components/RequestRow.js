import React, { Component } from "react";
import { Table, Button } from "semantic-ui-react";
import web3 from "../ethereum/web3";
import Campaign from "../ethereum/campaign";

class RequestRow extends Component {
  onApprove = async () => {
    //get account
    const accounts = await web3.eth.getAccounts();
    //create new portal to the deployed contract.
    const campaign = Campaign(this.props.address);
    //invoke approveRequest on campaign contract
    await campaign.methods
      .approveRequest(this.props.id)
      .send({ from: accounts[0] });
  };

  finalize = async () => {
    //get account
    const accounts = await web3.eth.getAccounts();
    //create new portal to the deployed contract.
    const campaign = Campaign(this.props.address);
    //invoke finalizeRequest on campaign contract
    await campaign.methods
      .finalizeRequest(this.props.id)
      .send({ from: accounts[0] });
  };

  render() {
    const { Row, Cell } = Table;
    const { id, request, approversCount } = this.props;
    // this var will be a boolean
    const readyToFinalize = request.approvalCount > approversCount / 2;

    return (
      <Row
        disabled={request.complete}
        positive={readyToFinalize && !request.complete}
      >
        {/*Disabled is a prop from SUR. Toggle it on or off based on request.complete */}
        {/* Positive will highlight the entire row if boolean is true*/}
        <Cell>{id}</Cell>
        <Cell>{request.description}</Cell>
        <Cell>{web3.utils.fromWei(request.value, "ether")}</Cell>
        <Cell>{request.recipient}</Cell>
        <Cell>
          {request.approvalCount}/{approversCount}
        </Cell>
        <Cell>
          {!request.complete && (
            <Button color="green" basic onClick={this.onApprove}>
              Approve
            </Button>
          )}
        </Cell>
        <Cell>
          {/*Null results in no JSX being displayed.*/}
          {request.complete ? null : (
            <Button color="teal" basic onClick={this.finalize}>
              Finalize
            </Button>
          )}
        </Cell>
      </Row>
    );
  }
}

export default RequestRow;
