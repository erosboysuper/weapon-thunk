import React, {Fragment} from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { alertsShow, removeReadItem, readNotifications, setLoadAlerts, removeAllNotifications } from '../../redux/alerts/alerts.action';
import { Link } from 'react-router-dom';
import './alerts.style.scss';
import EachAlertItem from './alert-item/alert-item.component';

const NotificationAlerts = ({
	toggleMenu, 
	alertItems, 
	alertsToggle, 
	removeReadItem, 
	readNotifications, 
	setLoadAlerts,
	removeAllNotifications }) => {

	const historyURL = useHistory();
	
	const handleChange = async (id, url) => {
		setLoadAlerts(true);
		const isSuccess = await readNotifications(id);
		if(isSuccess === "success"){
				removeReadItem(id);
				setLoadAlerts(false);
				if (url)
						historyURL.push(url);  
				alertsToggle();                   
		}
		else{
				setLoadAlerts(false);
				return;
		}	
	}

	const removeAllAlertsFunc = async () => {
		alertsToggle();
		setLoadAlerts(true);
		await removeAllNotifications();
		setLoadAlerts(false);
	}

	return (
		<div className="alerts-div-wrapper">
			<div className="triangleDiv"></div>
			<div className="alerts-popup-div">
				<div className="font-weight-bolder text-center top-div">
					{
						alertItems.length > 0 ? <Fragment>
								<span>Notifications</span>
								<button className='alerts-count-btn'>{alertItems.length}</button>
						</Fragment>
						:
								<span>No Notifications</span>
					}                    
				</div>
				<div className="notification-items-container" onClick={toggleMenu}>
					{
						alertItems.length > 0 &&
							alertItems.map(alertItem=>

								alertItem.service_type === "webinar_start" ?

								<a href={alertItem.webinar_link} target="_blank">
										<EachAlertItem key={alertItem.id} label="has been started" alertItem = { alertItem } clickFunc = {() =>handleChange(alertItem.id)}/>                                     
								</a>
							
								:

								alertItem.service_type === "new_product" ?

								<EachAlertItem key={alertItem.id} label="is newly added" alertItem = { alertItem } clickFunc = {() =>handleChange(alertItem.id,`/products/${alertItem.product_type}/${alertItem.product_id}`)}/>                          
						
								:

								<EachAlertItem key={alertItem.id} label="You won" alertItem = { alertItem } clickFunc = {() =>handleChange(alertItem.id)}/>           
											
							)
					}
				</div>
				{
					alertItems?.length > 0 && <Fragment>
						<Link onClick={toggleMenu} to = "/alerts_page">
								<div className="close-notification" onClick={alertsToggle}>
										<p className="text-center">View All Notifications</p>
								</div>
						</Link>
						<div className="close-notification remove" onClick={removeAllAlertsFunc}>
								<p className="text-center">Remove All</p>
						</div>
					</Fragment>
				}
			</div> 
		</div>
	)
};

const MapDispatchToProps = dispatch => ({
	alertsToggle: () => dispatch(alertsShow()),
	removeReadItem: (id) => dispatch(removeReadItem(id)),
	readNotifications: readNotifications(dispatch),
	setLoadAlerts: flag => dispatch(setLoadAlerts(flag)),
	removeAllNotifications: removeAllNotifications(dispatch)
})

export default connect(null, MapDispatchToProps)(NotificationAlerts);