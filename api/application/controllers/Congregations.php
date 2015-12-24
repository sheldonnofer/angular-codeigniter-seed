<?php

defined('BASEPATH') OR exit('No direct script access allowed');

require_once('./application/libraries/REST_Controller.php');

/**
 * Projects API controller
 *
 * Validation is missign
 */
class Congregations extends REST_Controller {

    public function __construct() {
        parent::__construct();
    }

    public function index_get() {
        $this->response($this->Congregations_model->get_all());
    }

    public function edit_get($id = NULL) {
        if (!$id) {
            $this->response(array('status' => false, 'error_message' => 'No ID was provided.'), 400);
        }

        $this->response($this->Congregations_model->get($id));
    }

    public function insert_post() {
            $new_id = $this->Congregations_model->add($this->post());
            $this->response(array('status' => true, 'id' => $new_id, 'message' => sprintf('Congregation #%d has been created.', $new_id)), 200);

    }
    
    public function update_post($id = NULL) {
            $this->Congregations_model->update($id, $this->post());
            $this->response(array('status' => true, 'message' => sprintf('Congregation #%d has been updated.', $id)), 200);
    }

    public function remove_delete($id = NULL) {
        if ($this->Congregations_model->delete($id)) {
            $this->response(array('status' => true, 'message' => sprintf('Congregation #%d has been deleted.', $id)), 200);
        } else {
            $this->response(array('status' => false, 'error_message' => 'This Congregation does not exist!'), 404);
        }
    }

}

/* End of file Projects.php */
/* Location: ./application/controllers/api/Projects.php */