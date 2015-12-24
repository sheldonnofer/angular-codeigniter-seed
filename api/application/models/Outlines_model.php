<?php

if (!defined('BASEPATH'))
    exit('No direct script access allowed');

class Outlines_model extends CI_Model {

    public $table = 'outlines';

    public function get_all() {
        return $this->db->get($this->table)->result();
    }

    public function get($id) {
//        $this->db->select('outline');
//        $this->db->from('speaker_outlines');
        return $this->db->where('outline', $id)->get($this->table)->result();
    }

    public function add($data) {
        $this->db->insert($this->table, $data);
        return $this->db->insert_id();
    }

    public function update($id, $data) {
        return $this->db->where('speaker', $id)->update($this->table, $data);
    }

    public function delete($id) {
        $this->db->where('id', $id)->delete($this->table);
        return $this->db->affected_rows();
    }

}

/* End of file Project_model.php */
/* Location: ./application/models/Project_model.php */