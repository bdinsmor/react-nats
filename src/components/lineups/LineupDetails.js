/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from 'react';
import { Layout, Drawer, Input, Form, Select, Row, Col, Button, Space, DatePicker } from 'antd';

import { useReactToPrint } from 'react-to-print';
import { SaveOutlined, PrinterOutlined, OrderedListOutlined, CloseOutlined, CheckOutlined } from '@ant-design/icons';
import ReorderIcon from '@material-ui/icons/Reorder';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableFooter from '@material-ui/core/TableFooter';
import Paper from '@material-ui/core/Paper';
import Icon from '@ant-design/icons';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import { ReactComponent as FieldSvg } from '../../diamond.svg';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import UpdatePlayer from '../players/UpdatePlayer';

import dayjs from 'dayjs';
let localizedFormat = require('dayjs/plugin/localizedFormat');
dayjs.extend(localizedFormat);
const { Option } = Select;
const { Content } = Layout;

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

const printStyle = `
  @media print {
  @page { size: landscape; }
}

 @media all {
  .page-break {
    display: none;
  }
}

  @media print {
  html, body {
    height: initial !important;
    overflow: initial !important;
    -webkit-print-color-adjust: exact;
    zoom: 95%;
  }
}

  @media print {
    .MuiTableCell-root {
      padding-left: 16px !important;
      padding-right: 16px !important;
      padding-top: 18px !important;
      padding-bottom: 18px !important;
    }
    .page-break {
    margin-top: 1rem;
    display: block;
    page-break-after: always;
  }
  }
`;

const LineupDetails = (props) => {
  const componentRef = useRef();
  const [form] = Form.useForm();
  const [showDiagram, setShowDiagram] = useState(false);
  const [lineup, setLineup] = useState({});
  const [isPrinting, setIsPrinting] = useState(false);
  const [positions, setPositions] = useState([]);
  const [showUpdateDrawer, setShowUpdateDrawer] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState({});
  const [currentLineup, setCurrentLineup] = useState({ date: '', opponent: '', location: '' });
  const [innings, setInnings] = useState([
    { number: 1, playing: [], sitting: [] },
    { number: 2, playing: [], sitting: [] },
    { number: 3, playing: [], sitting: [] },
    { number: 4, playing: [], sitting: [] },
    { number: 5, playing: [], sitting: [] },
    { number: 6, playing: [], sitting: [] },
  ]);

  const FieldIcon = (props) => <Icon component={FieldSvg} {...props} style={{ fontSize: '28px', marginTop: '-3px' }} />;
  const saveLineup = async (formValues) => {
    const l = { ...lineup };
    l.date = dayjs(formValues.date).format('MM/DD/YYYY');
    l.opponent = formValues.opponent;
    l.location = formValues.location;
    props.onSaveLineup(l);
  };

  const classes = useStyles();

  const handleDragEnd = (result, provided) => {
    if (!result.destination) {
      return;
    }

    if (result.destination.index === result.source.index) {
      return;
    }

    setLineup((prev) => {
      const temp = { ...prev };
      const playing = temp.playing;
      const player = playing[result.source.index];
      playing.splice(result.source.index, 1);
      playing.splice(result.destination.index, 0, player);
      let index = 1;
      playing.forEach((p) => {
        p.index = index;
        index++;
      });
      temp.playing = playing;
      return temp;
    });
  };

  const getPosition = (abbr) => {
    const numPositions = positions.length;
    for (let i = 0; i < numPositions; i++) {
      if (abbr === positions[i].abbr) {
        return positions[i];
      }
    }
    return null;
  };

  const onPositionChange = (e, index, player, playerIndex) => {
    let newPosition = getPosition(e);
    const inningNumber = index + 1;
    newPosition.inning = inningNumber;
    player.innings = [...player.innings];
    player.innings[index] = newPosition;
    try {
      calculatePlayerBenchInnings(player);
      calculatePlayerOutfieldInnings(player);
      calculatePlayerRestrictedInnings(player);
      calculateOutfieldMet(player);

      lineup.playing[playerIndex] = { ...player };
      lineup.inningValidations[index] = { msg: validateInning(inningNumber), tooMany: checkInningForDups(inningNumber) };
      setLineup({ ...lineup });
    } catch (err) {
      console.log('caught error: ', err);
    }
  };

  const validateInnings = () => {
    for (let i = 0; i < 6; i++) {
      lineup.inningValidations[i] = { msg: validateInning(i + 1), tooMany: checkInningForDups(i + 1) };
    }
    setLineup({ ...lineup });
  };

  const reIndex = (list) => {
    let index = 1;
    list.forEach((item) => {
      item.index = index;

      index++;
    });
  };

  const removePlayer = (player, index) => {
    lineup.playing.splice(index, 1);
    if (!lineup.notPlaying) {
      lineup.notPlaying = [];
    }
    lineup.notPlaying.push(player);
    reIndex(lineup.playing);
    reIndex(lineup.notPlaying);
    setLineup({ ...lineup });
  };

  const addPlayerToLineup = (player, index) => {
    lineup.notPlaying.splice(index, 1);
    lineup.playing.push(player);
    reIndex(lineup.playing);
    reIndex(lineup.notPlaying);
    setLineup({ ...lineup });
  };

  const getPositionDisplay = (number) => {
    const numChoices = positions.length;
    for (let i = 0; i < numChoices; i++) {
      if (positions[i].number === number) {
        return positions[i].abbr;
      }
    }
  };

  const checkInningForDups = (inningNumber) => {
    let map = {};
    let msg = [];
    let numInnings = 0;
    //console.log("inning: "+ number);
    let numPlaying = lineup.playing.length;
    for (let i = 0; i < numPlaying; i++) {
      let player = lineup.playing[i];
      numInnings = player.innings.length;
      // console.log("player: " + player.name + " has " + player.innings.length);
      for (let j = 0; j < numInnings; j++) {
        //.log(player.name + "\tposition: " + player.innings[j].inning)
        if (player.innings[j].inning === inningNumber) {
          let position = player.innings[j];
          if (position.number > 0) {
            let positionDisplay = getPositionDisplay(position.number);
            if (!map[positionDisplay]) {
              map[positionDisplay] = player.nickname;
            } else {
              msg.push(positionDisplay);
            }
          }
        }
      }
    }
    if (msg && msg.length > 0) {
      let ret = '';
      for (let i = 0; i < msg.length; i++) {
        if (i > 0) {
          ret = ret + ', ';
        }
        ret += msg[i];
      }
      return ret;
    } else {
      return '';
    }
    //return {playing: playing, sitting: sitting};
  };

  const validateInning = (inning) => {
    let requiredPositions = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    const numPlayers = lineup.playing.length;
    if (numPlayers === 8) {
      requiredPositions = [1, 2, 3, 4, 5, 6, 7, 8];
    }
    for (let i = 0; i < numPlayers; i++) {
      const player = lineup.playing[i];
      const numInnings = player.innings.length;
      for (let j = 0; j < numInnings; j++) {
        if (player.innings[j].inning === inning) {
          const position = player.innings[j];
          if (position.number > 0) {
            const numRequired = requiredPositions.length;
            for (let k = 0; k < numRequired; k++) {
              if (position.number === requiredPositions[k]) {
                delete requiredPositions[k];
                requiredPositions = requiredPositions.filter(function () {
                  return true;
                });
                break;
              }
            }
          }
        }
      }
    }
    let msg = '';
    requiredPositions = requiredPositions.filter(function () {
      return true;
    });
    if (requiredPositions && requiredPositions.length > 0) {
      const numRequired = requiredPositions.length;
      for (let i = 0; i < numRequired; i++) {
        if (i > 0) {
          msg += ', ';
        }
        msg += getPositionDisplay(requiredPositions[i]);
      }
    }
    return msg;
  };

  const calculateOutfieldMet = (player) => {
    const positions = player.innings;
    const numPlayers = lineup.playing.length;
    const numPositions = positions.length;
    let minInning = 3;
    if (numPlayers < 12) {
      minInning = 4;
    }
    let good = false;
    for (let i = 0; i < numPositions; i++) {
      if (parseInt(positions[i].inning) <= minInning && positions[i].number > 6) {
        good = true;
        break;
      }
    }
    player.outfieldMet = good ? 'yes' : 'no';
  };

  const calculatePlayerBenchInnings = (player) => {
    const positions = player.innings;
    const numPositions = positions.length;
    let totalBenchInnings = 0;
    for (let i = 0; i < numPositions; i++) {
      if (positions[i].number === 0) {
        totalBenchInnings++;
      }
    }
    player.numBench = totalBenchInnings;
  };

  const calculatePlayerOutfieldInnings = (player) => {
    const positions = player.innings;
    let num = 0;
    const numOutfield = positions.length;
    for (let i = 0; i < numOutfield; i++) {
      if (positions[i].number > 6) {
        num++;
      }
    }
    player.numOutfield = num;
  };

  const calculatePlayerRestrictedInnings = (player) => {
    const innings = player.innings;
    let pos = [];
    const numInnings = innings.length;
    for (let i = 0; i < numInnings; i++) {
      if (innings[i].number === 1) {
        let nextInning = i + 1;
        pos.push(nextInning + ': ' + getPositionDisplay(innings[i].number));
      }
    }
    pos = pos.sort();
    let disp = '';
    if (pos.length === 0) {
      player.restrictedPositions = '';
      return;
    }
    for (let j = 0; j < pos.length; j++) {
      if (j > 0) {
        disp += ', ';
      }
      disp += pos[j];
    }
    player.restrictedPositions = disp;
  };

  const generateDiagram = () => {
    const num = innings.length;
    for (let i = 0; i < num; i++) {
      const inning = innings[i];
      const inningPlayers = getPlayersForInning(inning.number);
      inning.playing = inningPlayers.playing;
      inning.sitting = inningPlayers.sitting;
      innings[i] = { ...inning };
    }
    //  console.log('innings: ' + JSON.stringify(innings, null, 2));
    setInnings([...innings]);
  };

  const getPlayersForInning = (number) => {
    const playing = [];
    const sitting = [];
    let numInnings = 0;
    let player = null;
    //console.log("inning: "+ number);
    const numPlaying = lineup.playing.length;
    //console.log("inning: "+ number);
    for (let i = 0; i < numPlaying; i++) {
      player = lineup.playing[i];
      numInnings = player.innings.length;
      // console.log('player: ' + player.nickname + ' has ' + player.innings.length);
      for (let j = 0; j < numInnings; j++) {
        if (player.innings[j].inning === number) {
          const position = player.innings[j];

          if (position.number > 0) {
            player.lowercasename = player.nickname.toLowerCase();
            const playingPlayer = {
              player: player,
              positionClassName: getFullPositionName(position.number),
              style: { backgroundColor: player.backgroundColor, color: player.textColor },
            };
            playing.push(playingPlayer);
          } else {
            //  console.log(player.nickname + ' sitting for inning ' + number);
            sitting.push(player);
          }
        }
      }
    }
    //  console.log('playing: ' + JSON.stringify(playing, null, 2));
    return { playing: playing, sitting: sitting };
  };

  const getFullPositionName = (number) => {
    let numChoices = positions.length;
    for (let i = 0; i < numChoices; i++) {
      if (positions[i].number === number) {
        return positions[i].className;
      }
    }
  };

  const toggleDiagram = () => {
    if (!showDiagram) {
      generateDiagram();
    }
    setShowDiagram(!showDiagram);
  };

  const handlePrint = useReactToPrint({
    pageStyle: printStyle,
    content: () => componentRef.current,
    onAfterPrint: () => setIsPrinting(false),
  });

  const print = () => {
    setIsPrinting(true);
    generateDiagram();
    handlePrint();
  };

  const editPlayer = (player) => {
    setSelectedPlayer(player);
    setShowUpdateDrawer(true);
  };

  const onUpdatePlayerSuccess = (updatedPlayer) => {
    setShowUpdateDrawer(false);
    props.onPlayerUpdated(updatedPlayer);
  };

  useEffect(() => {
    const values = form.getFieldsValue();
    setCurrentLineup({
      date: values.date,
      oppenent: values.opponent && values.opponent !== '' ? values.opponent : '&nbsp;',
      location: values.location,
    });
  }, [isPrinting]);

  useEffect(() => {
    if (props.positions) {
      setPositions(props.positions);
    }
  }, [props.positions]);

  useEffect(() => {
    form.setFieldsValue(props.lineup);
    setLineup(props.lineup);
  }, [props.lineup]);

  return (
    <React.Fragment>
      <Layout>
        <Content>
          <div style={{ marginBottom: 8 }}>
            <Col>
              <Form layout="inline" form={form} onFinish={saveLineup}>
                <Row gutter={12}>
                  <Col>
                    <h5>Date</h5>
                    <Form.Item name="date">
                      <DatePicker placeholder="Date of Game" format="MM/DD/YYYY" allowClear={false} />
                    </Form.Item>
                  </Col>
                  <Col>
                    <h5>Opponent</h5>
                    <Form.Item name="opponent">
                      <Input placeholder="Opponent" />
                    </Form.Item>
                  </Col>
                  <Col>
                    <h5>Location</h5>
                    <Form.Item name="location">
                      <Input placeholder="Location" />
                    </Form.Item>
                  </Col>
                  <Col>
                    <h5># Innings finished</h5>
                    <Form.Item name="numInningsFinished">
                      <Input placeholder="# Innings Finished" />
                    </Form.Item>
                  </Col>
                  <Col>
                    <h5>&nbsp;</h5>
                    <Form.Item>
                      <Button type="ghost" icon={<CheckOutlined />} onClick={() => validateInnings()}>
                        Validate
                      </Button>
                    </Form.Item>
                  </Col>
                  <Col>
                    <h5>&nbsp;</h5>
                    <Form.Item>
                      <Button htmlType="submit" icon={<SaveOutlined />}>
                        Save
                      </Button>
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
              <Row>
                <Space>
                  <Col>
                    <h5>&nbsp;</h5>
                    <Form.Item>
                      {!showDiagram && (
                        <Button
                          type="primary"
                          onClick={() => {
                            toggleDiagram();
                          }}
                          icon={<FieldIcon />}
                        >
                          <span className="bump-up">Show Field</span>
                        </Button>
                      )}
                      {showDiagram && (
                        <Button
                          type="primary"
                          onClick={() => {
                            toggleDiagram();
                          }}
                          icon={<OrderedListOutlined />}
                        >
                          <span>Show Batting Order</span>
                        </Button>
                      )}
                    </Form.Item>
                  </Col>
                  <Col>
                    <h5>&nbsp;</h5>
                    <Form.Item>
                      <Button
                        type="primary"
                        icon={<PrinterOutlined />}
                        onClick={() => {
                          print();
                        }}
                      >
                        Print
                      </Button>
                    </Form.Item>
                  </Col>
                </Space>
              </Row>
            </Col>
          </div>
          <div ref={componentRef}>
            {(!showDiagram || isPrinting) && (
              <div className="page-break">
                {isPrinting && (
                  <Row gutter={36} style={{ width: '100%' }}>
                    <Space>
                      <Col>
                        <h5>Date</h5>
                        <div>{currentLineup.date}</div>
                      </Col>
                      <Col>
                        <h5>Opponent</h5>
                        <div>{currentLineup.opponent}</div>
                      </Col>
                      <Col>
                        <h5>Location</h5>
                        <div>{currentLineup.location}</div>
                      </Col>
                    </Space>
                  </Row>
                )}
                <TableContainer component={Paper}>
                  <Table className={classes.table} aria-label="simple table">
                    <TableHead>
                      <TableRow>
                        {!isPrinting && <TableCell size="small"></TableCell>}
                        <TableCell size="small" align="left">
                          Batting
                        </TableCell>
                        <TableCell size="small" align="left">
                          Jersey
                        </TableCell>
                        <TableCell size="small" align="left">
                          Player
                        </TableCell>
                        <TableCell size="small" align="center">
                          1st Inning
                        </TableCell>
                        <TableCell size="small" align="center">
                          2nd Inning
                        </TableCell>
                        <TableCell size="small" align="center">
                          3rd Inning
                        </TableCell>
                        <TableCell size="small" align="center">
                          4th Inning
                        </TableCell>
                        <TableCell size="small" align="center">
                          5th Inning
                        </TableCell>
                        <TableCell size="small" align="center">
                          6th Inning
                        </TableCell>
                        {!isPrinting && (
                          <TableCell size="small" className="no-print">
                            # Outfield
                          </TableCell>
                        )}
                        {!isPrinting && (
                          <TableCell size="small" className="no-print">
                            Outfield Met
                          </TableCell>
                        )}
                        {!isPrinting && (
                          <TableCell size="small" className="no-print">
                            # Bench
                          </TableCell>
                        )}
                        {!isPrinting && (
                          <TableCell size="small" className="no-print">
                            # Prime
                          </TableCell>
                        )}
                        {!isPrinting && <TableCell size="small" className="no-print"></TableCell>}
                      </TableRow>
                    </TableHead>
                    <DragDropContext onDragEnd={handleDragEnd}>
                      <Droppable droppableId="droppable" direction="vertical">
                        {(droppableProvided) => (
                          <TableBody ref={droppableProvided.innerRef} {...droppableProvided.droppableProps}>
                            {lineup &&
                              lineup.playing &&
                              lineup.playing.map((row, rowIndex) => (
                                <Draggable key={`draggable_row_${row.id}`} draggableId={row.id} index={rowIndex}>
                                  {(draggableProvided, snapshot) => (
                                    <TableRow
                                      ref={draggableProvided.innerRef}
                                      {...draggableProvided.draggableProps}
                                      style={{
                                        ...draggableProvided.draggableProps.style,
                                        background: snapshot.isDragging ? 'rgba(245,245,245, 0.75)' : row.backgroundColor,
                                      }}
                                    >
                                      {!isPrinting && (
                                        <TableCell size="small" align="left" className="no-print" style={{ color: row.textColor }}>
                                          <div {...draggableProvided.dragHandleProps}>
                                            <ReorderIcon />
                                          </div>
                                        </TableCell>
                                      )}
                                      <TableCell size="small" className="print-small-margins" align="left" style={{ color: row.textColor }}>
                                        {row.index}
                                      </TableCell>
                                      <TableCell size="small" className="print-small-margins" align="left" style={{ color: row.textColor }}>
                                        {row.jersey}
                                      </TableCell>
                                      <TableCell size="small" className="print-small-margins" align="left" style={{ color: row.textColor }}>
                                        <Button
                                          type="link"
                                          style={{ color: row.textColor }}
                                          onClick={() => {
                                            editPlayer(row);
                                          }}
                                        >
                                          {row.nickname}
                                        </Button>
                                      </TableCell>
                                      {row.innings.map((inning, inningIndex) => (
                                        <TableCell
                                          size="small"
                                          className="print-small-margins position-select"
                                          align="center"
                                          style={{ color: row.textColor }}
                                          key={`inning_col_${inningIndex}`}
                                        >
                                          {!isPrinting && (
                                            <Select
                                              defaultValue={inning.abbr}
                                              onChange={(e) => onPositionChange(e, inningIndex, row, rowIndex)}
                                              showArrow={false}
                                              style={{ width: 80, color: row.textColor, border: 'none' }}
                                            >
                                              {positions &&
                                                positions.map((position, index) => {
                                                  return (
                                                    <Option key={`position_choice_${row.id}_choice_${index}`} value={position.abbr}>
                                                      {position.abbr}
                                                    </Option>
                                                  );
                                                })}
                                            </Select>
                                          )}
                                          {isPrinting && <div style={{ color: row.textColor }}>{inning.abbr}</div>}
                                        </TableCell>
                                      ))}
                                      {!isPrinting && (
                                        <TableCell size="small" className="no-print" style={{ color: row.textColor }}>
                                          {row.numOutfield}
                                        </TableCell>
                                      )}
                                      {!isPrinting && (
                                        <TableCell size="small" className="no-print" style={{ color: row.textColor }}>
                                          {row.outfieldMet}
                                        </TableCell>
                                      )}
                                      {!isPrinting && (
                                        <TableCell size="small" className="no-print" style={{ color: row.textColor }}>
                                          {row.numBench}
                                        </TableCell>
                                      )}
                                      {!isPrinting && (
                                        <TableCell size="small" className="no-print" style={{ color: row.textColor }}>
                                          {row.restrictedPositions}
                                        </TableCell>
                                      )}
                                      {!isPrinting && (
                                        <TableCell size="small" className="no-print" style={{ color: row.textColor }}>
                                          <Button
                                            type="link"
                                            style={{ color: row.textColor }}
                                            onClick={() => {
                                              removePlayer(row, rowIndex);
                                            }}
                                            icon={<CloseOutlined />}
                                          ></Button>
                                        </TableCell>
                                      )}
                                    </TableRow>
                                  )}
                                </Draggable>
                              ))}
                            {droppableProvided.placeholder}
                          </TableBody>
                        )}
                      </Droppable>
                    </DragDropContext>
                    {!isPrinting && (
                      <TableFooter>
                        <TableRow>
                          <TableCell size="small"></TableCell>
                          <TableCell size="small"></TableCell>
                          <TableCell size="small"></TableCell>
                          <TableCell size="small" align="center">
                            Need:
                          </TableCell>
                          {lineup && lineup.inningValidations && (
                            <React.Fragment>
                              <TableCell align="center" size="small">
                                {lineup.inningValidations[0].msg}
                              </TableCell>
                              <TableCell align="center" size="small">
                                {lineup.inningValidations[1].msg}
                              </TableCell>
                              <TableCell align="center" size="small">
                                {lineup.inningValidations[2].msg}
                              </TableCell>
                              <TableCell align="center" size="small">
                                {lineup.inningValidations[3].msg}
                              </TableCell>
                              <TableCell align="center" size="small">
                                {lineup.inningValidations[4].msg}
                              </TableCell>
                              <TableCell align="center" size="small">
                                {lineup.inningValidations[5].msg}
                              </TableCell>
                            </React.Fragment>
                          )}

                          <TableCell size="small"></TableCell>
                          <TableCell size="small"></TableCell>
                          <TableCell size="small"></TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell size="small"></TableCell>
                          <TableCell size="small"></TableCell>
                          <TableCell size="small"></TableCell>
                          <TableCell size="small" align="center">
                            Too Many:
                          </TableCell>
                          {lineup && lineup.inningValidations && (
                            <React.Fragment>
                              <TableCell align="center" size="small">
                                {lineup.inningValidations[0].tooMany}
                              </TableCell>
                              <TableCell align="center" size="small">
                                {lineup.inningValidations[1].tooMany}
                              </TableCell>
                              <TableCell align="center" size="small">
                                {lineup.inningValidations[2].tooMany}
                              </TableCell>
                              <TableCell align="center" size="small">
                                {lineup.inningValidations[3].tooMany}
                              </TableCell>
                              <TableCell align="center" size="small">
                                {lineup.inningValidations[4].tooMany}
                              </TableCell>
                              <TableCell align="center" size="small">
                                {lineup.inningValidations[5].tooMany}
                              </TableCell>
                            </React.Fragment>
                          )}

                          <TableCell size="small"></TableCell>
                          <TableCell size="small"></TableCell>
                          <TableCell size="small"></TableCell>
                        </TableRow>
                      </TableFooter>
                    )}
                  </Table>
                </TableContainer>
              </div>
            )}
            {!isPrinting && !showDiagram && lineup.notPlaying && lineup.notPlaying.length > 0 && (
              <div className="no-print" style={{ paddingTop: '28px' }}>
                <h3>Players Not Playing</h3>
                <List>
                  {lineup.notPlaying.map((notP, notPlayingIndex) => {
                    return (
                      <ListItem key={`not_playing_${notPlayingIndex}`} style={{ backgroundColor: notP.backgroundColor, color: notP.textColor }}>
                        <ListItemText primary={notP.nickname} style={{ color: notP.textColor }} />
                        <ListItemSecondaryAction>
                          <IconButton
                            edge="end"
                            aria-label="add"
                            style={{ color: notP.textColor }}
                            onClick={() => {
                              addPlayerToLineup(notP, notPlayingIndex);
                            }}
                          >
                            <AddIcon />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                    );
                  })}
                </List>
              </div>
            )}

            {(isPrinting || showDiagram) && (
              <div>
                <div className="diagrams">
                  {innings &&
                    innings.map((inning, innIndex) => {
                      return (
                        <div className="diagram" key={`diagram_${innIndex}`} style={{ marginLeft: '12px', marginTop: '24px' }}>
                          <h2>{inning.number}</h2>
                          {inning.playing &&
                            inning.playing.map((p, pIndex) => {
                              return (
                                <span key={`label_${p.player.nickname}_${pIndex}`} className={`playerlabel ${p.positionClassName}`} style={p.style}>
                                  {p.player.nickname}
                                </span>
                              );
                            })}
                          {inning.sitting && inning.sitting.length > 0 && (
                            <div className="sittingBox">
                              <strong>Sitting:</strong>
                              <div className="sitting">
                                {inning.sitting.map((player, sittingIndex) => {
                                  return (
                                    <div key={`sitting_box_${player.nickname}_${sittingIndex}`}>
                                      <div style={{ padding: '3px', backgroundColor: player.backgroundColor, color: player.textColor }} className="sitting">
                                        {player.nickname}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                </div>
              </div>
            )}
          </div>
        </Content>
      </Layout>
      <Drawer placement="right" closable={false} onClose={() => setShowUpdateDrawer(false)} visible={showUpdateDrawer} width={600}>
        <UpdatePlayer player={selectedPlayer} positions={positions} onSaveSuccess={onUpdatePlayerSuccess} onCancel={() => setShowUpdateDrawer(false)}></UpdatePlayer>
      </Drawer>
    </React.Fragment>
  );
};
export default LineupDetails;
