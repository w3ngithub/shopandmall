import React from "react";
import classes from "./mall.module.css";
import MallCardComponent from "../mallCardComponent/MallCardComponent";

const Mall = ({ docs }) => {
    console.log("malls", docs);

    return (
        <div className={classes.container}>
            {docs?.map(
                (doc, ind) =>
                    ind <= 2 && <MallCardComponent key={doc.id} doc={doc} />
            )}
        </div>
    );
};

export default Mall;
