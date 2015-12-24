<?php

defined('BASEPATH') OR exit('No direct script access allowed');

require_once('./application/libraries/REST_Controller.php');

/**
 * Projects API controller
 *
 * Validation is missign
 */
class SpeakerOutlines extends REST_Controller {

    public function __construct() {
        parent::__construct();
    }

    public function index_get() {
        $this->response($this->Speaker_outlines_model->get_all());
    }

    public function edit_get($id = NULL) {
        if (!$id) {
            $this->response(array('status' => false, 'error_message' => 'No ID was provided.'), 400);
        }
        $this->response($this->Speaker_outlines_model->get($id));
    }

    public function insert_post() {
            $new_id = $this->Speaker_outlines_model->add($this->post());
            $this->response(array('status' => true, 'id' => $new_id, 'message' => sprintf('Outline #%d has been added.', $new_id)), 200);
    }
    
    public function update_post($id){
        $this->Speaker_outlines_model->update($id, $this->post());
        $this->response(array('status' => true, 'message' => sprintf('Outline #%d has been updated.', $id)), 200);
    }

    public function remove_delete($id = NULL) {
        if ($this->Speaker_outlines_model->delete($id)) {
            $this->response(array('status' => true, 'message' => sprintf('Outline #%d has been deleted.', $id)), 200);
        } else {
            $this->response(array('status' => false, 'error_message' => 'This Outline does not exist!'), 404);
        }
    }

}

/* End of file Projects.php */
/* Location: ./application/controllers/api/Projects.php */