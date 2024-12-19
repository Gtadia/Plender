import React, { Component } from 'react';
import { StyleSheet, View, Text, Dimensions, TouchableOpacity } from 'react-native';
import Swiper from 'react-native-swiper';
import dayjs from 'dayjs';
import PropTypes from 'prop-types';
import { For, Memo, Reactive, useObservable } from "@legendapp/state/react";

import isoWeek from 'dayjs/plugin/isoWeek' // ES 2015

dayjs.extend(isoWeek);

windowWidth = Dimensions.get('window').width;
windowHeight = Dimensions.get('window').height;

const getWeek = (date) => {
	const data = {
		start: dayjs(date).startOf('isoWeek'),
		end: dayjs(date).endOf('isoWeek')
	};
	let day = data.start;
	let days = [];
	while (day <= data.end) {
		days = [ ...days, day ];
		day = day.clone().add(1, 'day');
	}
	return days;
};

//TODO merge this two functions into one
const getShowingHeaderItems = (week, format) => {
	const firstVar = dayjs(week[0]).format(format);
	const lastVar = dayjs(week[week.length - 1]).format(format);

	if (firstVar === lastVar) {
		return firstVar;
	}

	return firstVar + '/' + lastVar;
};

class Calendar extends Component {
	state = {
		weeks: null,
		activeDay: null,
		pages: [ '-1', '0', '1' ],
		key: 0,
		showingMonths: '',
		showingYears: ''
	};

	static defaultProps = {
		startingDate: dayjs(),
		secondaryColor: 'steelblue',
		backgroundColor: '#fff',
		height: 75,
		showMonth: true,
		showYear: true,
		activeDayBorderColor: 'steelblue'
	};

	componentDidMount() {
		if (this.props.onMount !== undefined) {
			this.props.onMount();
		}
		const weeks = this.getWeeks(this.props.startingDate);
		
		this.setState({
			weeks: weeks,
			activeDay: dayjs(),
			showingMonths: getShowingHeaderItems(weeks[this.state.pages[1]], 'MMMM'),
			showingYears: getShowingHeaderItems(weeks[this.state.pages[1]], 'YYYY')
		});
	}

	getWeeks = (date) => {
		const weeks = {
			[parseInt(this.state.pages[0]) - 1]: getWeek(dayjs(date).subtract(2, 'weeks')),
			[this.state.pages[0]]: getWeek(dayjs(date).subtract(1, 'weeks')),
			[this.state.pages[1]]: getWeek(dayjs(date)),
			[this.state.pages[2]]: getWeek(dayjs(date).add(1, 'weeks')),
			[parseInt(this.state.pages[2]) + 1]: getWeek(dayjs(date).add(2, 'weeks'))
		};

		return weeks;
	};

	dayPressedHandler = (day) => {
		this.setState({
			activeDay: day
		});
		if (this.props.dayPressed !== undefined) {
			this.props.dayPressed(day);
		}
	};

	componentDidUpdate(prevProps, prevState) {
		if (prevProps.activeDay !== this.props.activeDay) {
			this.handleActiveDayChange();
		}
	}

	handleActiveDayChange = (date) => {
		const activeWeekNumber = this.state.weeks[this.state.pages[1]][3].format('W');
		const activeDayWeekNumber = this.props.activeDay.format('W');

		if (activeWeekNumber === activeDayWeekNumber) {
			this.setState({
				activeDay: this.props.activeDay
			});
		}
		if (activeDayWeekNumber - activeWeekNumber === 1 || activeDayWeekNumber - activeWeekNumber === -1) {
			//this.swiper.scrollBy(activeDayWeekNumber - activeWeekNumber + 1, true);
			this.swiperScrollHandler(activeDayWeekNumber - activeWeekNumber + 1);
			this.setState({
				activeDay: this.props.activeDay
			});
		}
		if (Math.abs(activeDayWeekNumber - activeWeekNumber) > 1) {
			const weeks = this.getWeeks(this.props.activeDay);
			this.setState({
				weeks: weeks,
				activeDay: this.props.activeDay,
				showingMonths: getShowingHeaderItems(weeks[this.state.pages[1]], 'MMMM'),
				showingYears: getShowingHeaderItems(weeks[this.state.pages[1]], 'YYYY')
			});
		}
	};

	swiperScrollHandler = (index) => {
		if (this.props.calendarSwiped !== undefined) {
			this.props.calendarSwiped(index);
		}
		if (index === 0) {
			const newPages = this.state.pages.map((e) => (parseInt(e) - 1).toString());
			const newKey = this.state.key + 1;
			let weeksObjKeys = Object.keys(this.state.weeks);
			const nextKey = Math.min(...weeksObjKeys) - 1;
			const deleteKey = Math.max(...weeksObjKeys);

			weeks = {
				...this.state.weeks,
				[nextKey]: getWeek(dayjs(this.state.weeks[this.state.pages[1]][3]).subtract(3, 'weeks'))
			};

			delete weeks[deleteKey];

			const newActiveDay = dayjs(this.state.activeDay).subtract(1, 'weeks');

			this.setState({
				key: newKey,
				pages: newPages,
				weeks: weeks,
				//activeDay: newActiveDay,
				showingMonths: getShowingHeaderItems(weeks[newPages[1]], 'MMMM')
			});
		} else if (index === 2) {
			const newPages = this.state.pages.map((e) => (parseInt(e) + 1).toString());
			const newKey = this.state.key + 1;
			let weeksObjKeys = Object.keys(this.state.weeks);
			const nextKey = Math.max(...weeksObjKeys) + 1;
			const deleteKey = Math.min(...weeksObjKeys);

			weeks = {
				...this.state.weeks,
				[nextKey]: getWeek(dayjs(this.state.weeks[this.state.pages[1]][3]).add(3, 'weeks'))
			};

			delete weeks[deleteKey];

			const newActiveDay = dayjs(this.state.activeDay).add(1, 'weeks');

			this.setState({
				key: newKey,
				pages: newPages,
				weeks: weeks,
				//activeDay: newActiveDay,
				showingMonths: getShowingHeaderItems(weeks[newPages[1]], 'MMMM'),
				showingYears: getShowingHeaderItems(weeks[newPages[1]], 'YYYY')
			});
		}
	};

	render() {
		return (
			<View style={[ { height: this.props.height }, { ...this.props.style } ]}>
				<Header
					headerStyle={this.props.headerStyle}
					headerText={this.props.headerText}
					showingMonths={this.state.showingMonths}
					showingYears={this.state.showingYears}
					showYear={this.props.showYear}
					showMonth={this.props.showMonth}
				/>
				{this.state.weeks !== null ? (
					<Swiper
						ref={(ref) => (this.swiper = ref)}
						key={this.state.key}
						onIndexChanged={this.swiperScrollHandler}
						showsPagination={false}
						loop={false}
						index={1}
					>
						{this.state.pages.map((page, index) => {
							return (
								<View key={index} style={{ flexDirection: 'row' }}>
									{this.state.weeks[page].map((day, index) => {
										return (
											<Day
												click={() => this.dayPressedHandler(day)}
												active={
													dayjs(day).format('MM-DD-YYYY') ===
													this.state.activeDay.format('MM-DD-YYYY')
												}
												key={index}
												dayNumber={dayjs(day).format('D')}
												dayInWeekName={dayjs(day).format('ddd')}
												activeDayBorderColor={this.props.activeDayBorderColor}
												dateNameStyle={this.props.dateNameStyle}
												dateNumberStyle={this.props.dateNumberStyle}
											/>
										);
									})}
								</View>
							);
						})}
					</Swiper>
				) : null}
			</View>
		);
	}
}

const Day = (props) => {
	return (
		<TouchableOpacity
			onPress={props.click}
			style={[ styles.Day, props.active ? { borderBottomColor: props.activeDayBorderColor } : null ]}
		>
			<Text style={[ { color: 'steelblue', fontSize: 12 }, { ...props.dateNameStyle } ]}>
				{props.dayInWeekName}
			</Text>
			<Text style={[ { fontSize: 15 }, { ...props.dateNumberStyle } ]}>{props.dayNumber}</Text>
		</TouchableOpacity>
	);
};

const Header = (props) => {
	let spaceBetweenMonthAndYear = false;
	if (props.showMonth && props.showYear) {
		spaceBetweenMonthAndYear = true;
	}
	return (
		<View style={[ styles.HeaderWrapper, { ...props.headerStyle } ]}>
			{props.showMonth ? (
				<Text style={[ styles.HeaderText, { ...props.headerText } ]}>{props.showingMonths}</Text>
			) : null}
			{spaceBetweenMonthAndYear ? <Text> </Text> : null}
			{props.showYear ? (
				<Text style={[ styles.HeaderText, { ...props.headerText } ]}>{props.showingYears}</Text>
			) : null}
		</View>
	);
};

Calendar.propTypes = {
	startingDate: PropTypes.instanceOf(dayjs),
	height: PropTypes.number,
	showHeader: PropTypes.bool,
	showYear: PropTypes.bool,

	dayPressed: PropTypes.func,
	calendarSwiped: PropTypes.func,
	onMount: PropTypes.func
};

const styles = StyleSheet.create({
	Day: {
		width: windowWidth / 7,
		alignItems: 'center',
		justifyContent: 'center',
		borderBottomWidth: 2,
		borderBottomColor: 'rgba(0, 0, 0, 0)'
	},
	HeaderWrapper: {
		justifyContent: 'center',
		paddingVertical: 5,
		flexDirection: 'row'
	},
	HeaderText: {
		fontSize: 12,
		color: 'rgba(0, 0, 0, .7)'
	}
});

export default Calendar;