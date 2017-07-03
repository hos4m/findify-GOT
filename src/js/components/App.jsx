import React, { Component } from 'react';
import HTTPRequest from '../helpers/API';
import { Button, Row, Modal, Table } from 'react-bootstrap';

export default class App extends Component {
  constructor() {
    super();
    this.state = {
      page: 1,
      characters: [],
      relationshipsCharacters: {},
      showInfoModal: false,
      modalCharacter: {},
    }
  }

  componentWillReceiveProps(nextProps) {
    nextProps.data.GOTReducers.then((response) => {
      this.setState({ characters: response }, () => {
        this.getRelationshipCharacetersData();
      });
    })
  }

  componentWillMount() {
    let Component = this;
    
    HTTPRequest.getCharacters(this.state.page)
      .then(function (response) {
        if (response.data.length > 0) {
          Component.setState({ characters: response.data }, () => {
            Component.getRelationshipCharacetersData();
          })
        }
      })
      .catch(function (error) {
        console.log(error);
        return;
      });
  }

  getRelationshipCharacetersData() {
    let Component = this;

    // Get IDs of father/mother/spouse characters mentioned in the page
    let charactersIDs = [];
    Component.state.characters.map((character) => {
      if (character.father || character.mother || character.spouse) {
        charactersIDs.push(character.father.split("/")[5], character.mother.split("/")[5], character.spouse.split("/")[5]);
      }
    });

    // Remove undefined values
    let charactersIDsFiltered = charactersIDs.filter((element) => element !== undefined);

    // Get data of these characters IDs
    let relationshipsCharacters = {};
    let charactersIDsFilteredPromise = charactersIDsFiltered.map((id) => {
      return HTTPRequest.getCharacterByID(id)
        .then((response) => {
          relationshipsCharacters[id] = response.data;
        })
        .catch((err) => {
          console.log('------------------------------------');
          console.log(err);
          console.log('------------------------------------');
        });
    });

    // Update componenet state with the relationshipsCharacters data
    Promise.all(charactersIDsFilteredPromise).then(function () {
      Component.setState({ relationshipsCharacters }, () => {
      });
    });
  }

  getNextDataPressed() {
    if (this.state.page >= 1) {
      this.setState({
        page: this.state.page + 1
      }, () => {
        this.props.getNextData({ page: this.state.page });
        window.scrollTo(0, 0);
      });
    }
  }

  getPrevDataPressed() {
    if (this.state.page > 1) {
      this.setState({
        page: this.state.page - 1
      }, () => {
        this.props.getPrevData({ page: this.state.page });
        window.scrollTo(0, 0);
      });
    }
  }

  closeInfoModal() {
    this.setState({
      modalCharacter: {},
      showInfoModal: false,
    });
  }

  openInfoModal(character) {
    this.setState({
      modalCharacter: character,
      showInfoModal: true,
    });
  }

  printValue(value) {
    return value ? value : '–';
  }

  render() {
    return (
      <Row className="mainAppPage">
        <Row className="mainAppPage__headerTitle">
          <h1>Game of Thrones Characters' Relationships – Page {this.state.page}</h1>
        </Row>
        
        <Row className="characters">
          {this.state.characters.map((character) => {
            if (character.name || character.aliases.length > 0) {
              return ([
                <Row className="characters__single">
                  <Row className="characters__single__mainData">
                    <Row className="characters__single__mainData__title">
                      <h1>{this.printValue(character.name)}</h1>
                      <Button bsStyle="default" onClick={this.openInfoModal.bind(this, character)}>More Info</Button>
                    </Row>
                    
                    {character.aliases.map((alias) => {
                      return ([ <span className="characters__single__mainData__aliases">{alias}</span> ])
                    })}
                  </Row>

                  <Row className="characters__single__relationship">Father:&nbsp;
                    {character.father && this.state.relationshipsCharacters.hasOwnProperty(character.father.split("/")[5]) ? this.state.relationshipsCharacters[character.father.split("/")[5]].name : '–'}
                  </Row>
                  <Row className="characters__single__relationship">Mother:&nbsp;
                    {character.father && this.state.relationshipsCharacters.hasOwnProperty(character.mother.split("/")[5]) ? this.state.relationshipsCharacters[character.mother.split("/")[5]].name : '–'}
                  </Row>
                  <Row className="characters__single__relationship">Spouse:&nbsp;
                    {character.father && this.state.relationshipsCharacters.hasOwnProperty(character.spouse.split("/")[5]) ? this.state.relationshipsCharacters[character.spouse.split("/")[5]].name : '–'}
                  </Row>
                </Row>
              ]);
            }
          })}
        </Row>

        <Modal show={this.state.showInfoModal} onHide={this.closeInfoModal.bind(this)}>
          <Modal.Header closeButton>
            <Modal.Title>{this.printValue(this.state.modalCharacter.name)}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Table striped bordered>
              <tbody>
                <tr>
                  <td>Gender</td>
                  <td>{this.printValue(this.state.modalCharacter.gender)}</td>
                </tr>

                <tr>
                  <td>Culture</td>
                  <td>{this.printValue(this.state.modalCharacter.culture)}</td>
                </tr>

                <tr>
                  <td>Born</td>
                  <td>{this.printValue(this.state.modalCharacter.born)}</td>
                </tr>

                <tr>
                  <td>Died</td>
                  <td>{this.printValue(this.state.modalCharacter.died)}</td>
                </tr>

                <tr>
                  <td>Died</td>
                  <td>{this.printValue(this.state.modalCharacter.died)}</td>
                </tr>

                <tr>
                  <td>Titles</td>
                  <td>
                    {this.state.modalCharacter.titles && this.state.modalCharacter.titles.length > 0 &&
                      <Row>
                        {this.state.modalCharacter.titles.map((title) => {
                          return ([<Row>{title}</Row>])
                        })}
                      </Row>
                    }
                  </td>  
                </tr>
              </tbody>
            </Table>
          </Modal.Body>
        </Modal>

        <Row className="mainAppPage__footerButtons">
          <Button onClick={this.getPrevDataPressed.bind(this)} bsSize="large">
            Previous
          </Button>

          <Button bsStyle="primary" onClick={this.getNextDataPressed.bind(this)} bsSize="large">
            Next
          </Button>
        </Row>
      </Row>
    );
  }
}