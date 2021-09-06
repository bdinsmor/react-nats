import firebaseApp from './firebase-setup';
import { v4 as uuidv4 } from 'uuid';
import { Subject } from 'rxjs';
import dayjs from 'dayjs';
import moment from 'moment';
import { getFirestore, collection, doc, orderBy, query, onSnapshot, where, getDocs, setDoc } from 'firebase/firestore';
const db = getFirestore(firebaseApp);
const playersDb = collection(db, 'players');
const lineupsDb = collection(db, 'lineups');
const positionsDb = collection(db, 'positions');

const subject = new Subject();

export const lineupsSubject = {
  notify: (lineups) => subject.next(lineups),
  clear: () => subject.next(),
  getLineups: () => subject.asObservable(),
};

const sortLineups = (lineups) => {
  const lineupsByDate = {};
  let sortedLineups = [];
  lineups.forEach((lineup) => {
    lineup.key = lineup.id;

    const date = lineup.date;
    const year = dayjs(new Date(date)).year();
    const mth = year + ' ' + dayjs(new Date(date)).month();
    const month = dayjs(new Date(date)).format('MMMM');
    if (!lineupsByDate[mth]) {
      lineupsByDate[mth] = {
        month: month + ' ' + year,
        lineups: [lineup],
      };
    } else {
      lineupsByDate[mth].lineups.push(lineup);
    }
  });
  Object.keys(lineupsByDate).forEach(function (key, index) {
    let monthLineups = lineupsByDate[key].lineups;
    monthLineups = monthLineups
      .sort((o) => {
        return new Date(o.date);
      })
      .reverse();
    sortedLineups.push({
      key: uuidv4(),
      mth: key,
      month: lineupsByDate[key].month,
      lineups: monthLineups,
    });
  });
  sortedLineups = sortedLineups
    .sort((o) => {
      return o.mth;
    })
    .reverse();
  return sortedLineups;
};

const DataService = {
  // LINEUPS
  async formatLineups(docs) {
    const lineups = docs.map((lineup) => {
      try {
        lineup.date = moment(lineup.date, 'MM/DD/YYYY');
      } catch (err) {
        console.log('caught error: ', err);
      }
      return lineup;
    });
    //console.log('formatted: ' + JSON.stringify(lineups, null, 2));
    return sortLineups(lineups);
  },
  async getLineups(season, year) {
    // can't figure out why passing in the constiables isn't working...
    const q = query(lineupsDb, where('year', '==', 2021), where('season', '==', 'fall'), orderBy('date'));

    const res = await getDocs(q);
    const lineups = res.docs.map((doc) => {
      const lineup = doc.data();
      try {
        lineup.date = moment(lineup.date, 'MM/DD/YYYY');
      } catch (err) {
        console.log('caught error: ', err);
      }
      return lineup;
    });
    return sortLineups(lineups);
  },

  async subscribeToLineups(season, year) {
    const q = query(lineupsDb, where('year', '==', 2021), where('season', '==', 'fall'), orderBy('date'));
    const unsubscribe = onSnapshot(q, (lineupsSnapshot) => {
      const lineups = lineupsSnapshot.docs.map((doc) => {
        const lineup = doc.data();
        try {
          lineup.date = moment(lineup.date, 'MM/DD/YYYY');
        } catch (err) {
          console.log('caught error: ', err);
        }
        return lineup;
      });
      const lineupsByDate = {};
      let sortedLineups = [];
      lineups.forEach((lineup) => {
        lineup.key = lineup.id;

        const date = lineup.date;
        const year = dayjs(new Date(date)).year();
        const mth = year + ' ' + dayjs(new Date(date)).month();
        const month = dayjs(new Date(date)).format('MMMM');
        if (!lineupsByDate[mth]) {
          lineupsByDate[mth] = {
            month: month + ' ' + year,
            lineups: [lineup],
          };
        } else {
          lineupsByDate[mth].lineups.push(lineup);
        }
      });
      Object.keys(lineupsByDate).forEach(function (key, index) {
        let monthLineups = lineupsByDate[key].lineups;
        monthLineups = monthLineups
          .sort((o) => {
            return new Date(o.date);
          })
          .reverse();
        sortedLineups.push({
          key: uuidv4(),
          mth: key,
          month: lineupsByDate[key].month,
          lineups: monthLineups,
        });
      });
      sortedLineups = sortedLineups
        .sort((o) => {
          return o.mth;
        })
        .reverse();
      lineupsSubject.notify(sortedLineups);
    });
    return () => unsubscribe();
  },

  async getLineup(lineupId) {
    return await lineupsDb.doc(lineupId);
  },

  async updateLineup(lineup) {
    if (!lineup.id) {
      lineup.id = uuidv4();
    }
    try {
      const ref = doc(db, 'lineups', lineup.id);
      lineup.date = dayjs(lineup.date).format('MM/DD/YYYY');
      await setDoc(ref, lineup);
    } catch (err) {
      console.error('caught error: ', err, JSON.stringify(lineup, null, 2));
    }
  },

  async deleteLineup(lineupId) {
    return await lineupsDb.doc(lineupId).delete();
  },

  async getPositions() {
    try {
      const q = query(positionsDb, orderBy('number'));
      const res = await getDocs(q);
      return res.docs.map((doc) => doc.data());
    } catch (err) {
      console.error('caught error: ', err);
      throw err;
    }
  },

  // PLAYERS

  async getPlayers(season, year) {
    try {
      const q = query(playersDb, where('year', '==', '2021'), where('season', '==', 'fall'), orderBy('jersey'));

      const playersRes = await getDocs(q);
      return playersRes.docs.map((doc) => {
        const p = doc.data();
        p.year = parseInt(p.year);
        return p;
      });
    } catch (err) {
      console.error('caught error: ', err);
      throw err;
    }
  },

  async getPlayer(playerId) {
    return await playersDb.doc(playerId);
  },

  async updatePlayer(player) {
    if (!player.id) {
      player.id = uuidv4();
    }
    const playerRef = doc(db, 'players', player.id);
    await setDoc(playerRef, player);
  },

  async deletePlayer(player) {
    return await playersDb.doc(player.id).delete();
  },
};

export default DataService;
