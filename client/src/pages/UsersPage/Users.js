import React from 'react';
import { Link } from 'react-router-dom';
import userPhoto from "../../assets/images/user.png";
import './Users.scss';

let Users = (props) => {

    return (
        <div>
            <div>
                <span>
                    <div>
                       <Link>
                        <img alt='' src={userPhoto}
                             className={'userPhoto'}/>
                       </Link>
                    </div>
                    <div>
                        <button>Unfollow</button>
                         <button>Follow</button>

                    </div>
                </span>
                <span>
                    <span>
                        <div>{'u.name'}</div>
                        <div>{'u.status'}</div>
                    </span>
                    <span>
                        <div>{"u.location.country"}</div>
                        <div>{"u.location.city"}</div>
                    </span>
                </span>
            </div>
        </div>
    )
}

export default Users;