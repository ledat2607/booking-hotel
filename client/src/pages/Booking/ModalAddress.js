import React from 'react';
import { Dialog, DialogActionsBar } from '@progress/kendo-react-dialogs';
import { Button } from '@progress/kendo-react-buttons';

const ModalAddress = ({ isOpen, onClose, onUpdate }) => {
    return (
        isOpen && (
            <Dialog onClose={onClose}>
                <p>Please update your address to proceed with the booking.</p>
                <DialogActionsBar>
                    <Button themeColor="primary" onClick={onUpdate}>
                        Update Address
                    </Button>
                    <Button onClick={onClose}>Cancel</Button>
                </DialogActionsBar>
            </Dialog>
        )
    );
};

export default ModalAddress;
