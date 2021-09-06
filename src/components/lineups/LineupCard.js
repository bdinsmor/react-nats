import React, { useState, useEffect } from 'react';
import { Collapse, Space, Typography } from 'antd';

import LineupDetails from './LineupDetails';
import dayjs from 'dayjs';
var localizedFormat = require('dayjs/plugin/localizedFormat');
dayjs.extend(localizedFormat);
const { Text } = Typography;
const { Panel } = Collapse;
const LineupCard = (props) => {
  const [lineup, setLineup] = useState({});

  const onSaveLineup = (lineup) => {
    props.onSaveLineup(lineup);
  };

  const onPlayerUpdated = (player) => {
    props.onPlayerUpdated(player);
  };

  useEffect(() => {
    setLineup(props.lineup);
  }, [props.lineup]);

  const headerContent = (
    <div>
      <Space size={50}>
        <Text>
          <strong>{dayjs(lineup.date).format('MM/DD/YYYY')}</strong>
        </Text>
        <Text>Against: {lineup.opponent}</Text>
        <Text type="secondary">At: {lineup.location}</Text>
      </Space>
    </div>
  );

  return (
    <div className="lineup-card">
      <Collapse>
        <Panel header={headerContent} key={lineup.id} showArrow={false}>
          <LineupDetails lineup={lineup} allPlayers={props.allPlayers} positions={props.positions} onSaveLineup={onSaveLineup} onPlayerUpdated={onPlayerUpdated} />
        </Panel>
      </Collapse>
    </div>
  );
};
export default LineupCard;
