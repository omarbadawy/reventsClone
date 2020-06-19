import React, { Component } from 'react';
import { Grid } from 'semantic-ui-react';
import EventList from '../EventList/EventList';
import { connect } from 'react-redux';
import { createEvent, deleteEvent, updateEvent } from '../eventsActions';

class EventDashboard extends Component {
    handleDeleteEvent = id => {
        this.props.deleteEvent(id);
    };

    render() {
        const { events } = this.props;
        return (
            <Grid>
                <Grid.Column width={10}>
                    <EventList events={events} deleteEvent={this.handleDeleteEvent} />
                </Grid.Column>
                <Grid.Column width={6}>
                    <h2>Activity feed</h2>
                </Grid.Column>
            </Grid>
        );
    }
}

const mapStateToProps = state => {
    return {
        events: state.events
    };
};

const mapDispatchToProps = {
    createEvent,
    deleteEvent,
    updateEvent
};

export default connect(mapStateToProps, mapDispatchToProps)(EventDashboard);
