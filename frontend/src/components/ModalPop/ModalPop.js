import React from "react";
import "./ModalPop.css";

const ModalPop = ({ onClose, SentFile, fileLoading }) => {
  return (
    <div className="outerbox">
      <div className="box">
        <div className="boxtitle">
          <p className="close" onClick={() => onClose()}>
            &times;
          </p>
        </div>
        {fileLoading ? (
          <div className="box-content">Your File is loading</div>
        ) : (
          <div className="box-content">{SentFile}</div>
        )}

        <div className="boxfooter">
          <button className="btn btn-secondary" onClick={() => onClose()}>
            Close
          </button>
        </div>
      </div>
    </div>

    // <div>hi</div>

    // <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
    //   <div
    //     class="modal fade"
    //     id="staticBackdrop"
    //     data-bs-backdrop="static"
    //     data-bs-keyboard="false"
    //     tabindex="-1"
    //     aria-labelledby="staticBackdropLabel"
    //     aria-hidden="true"
    //   >
    //     <div class="modal-dialog">
    //       <div class="modal-content">
    //         <div class="modal-header">
    //           <h1 class="modal-title fs-5" id="staticBackdropLabel">
    //             Modal title
    //           </h1>
    //           <button
    //             type="button"
    //             class="btn-close"
    //             data-bs-dismiss="modal"
    //             aria-label="Close"
    //           ></button>
    //         </div>
    //         <div class="modal-body">...</div>
    //         <div class="modal-footer">
    //           <button
    //             type="button"
    //             class="btn btn-secondary"
    //             data-bs-dismiss="modal"
    //           >
    //             Close
    //           </button>
    //           <button type="button" class="btn btn-primary">
    //             Understood
    //           </button>
    //         </div>
    //       </div>
    //     </div>
    //   </div>
    // </div>
  );
};

export default ModalPop;
