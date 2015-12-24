<?php

if (!defined('BASEPATH'))
    exit('No direct script access allowed');

class Speakers_model extends CI_Model {

    public $table = 'speakers';

    public function get_all() {
        return $this->db->get($this->table)->result();
    }

    public function get($id) {
//        $this->db->select('c.name AS cong_name, c.id AS cong_id, s.name AS speaker_name, s.id AS speaker_id, s.congregation, s.phone, s.email');
//        $this->db->from('speakers s');
//        $this->db->join('congregations c', 'c.id = s.congregation');
        return $this->db->where('id', $id)->get($this->table)->row();
    }

    public function add($data) {
        $this->db->insert($this->table, $data);
        return $this->db->insert_id();
    }

    public function update($id, $data) {
        return $this->db->where('id', $id)->update($this->table, $data);
    }

    public function delete($id) {
        $this->db->where('id', $id)->delete($this->table);
        return $this->db->affected_rows();
    }

}

/* End of file Project_model.php */
/* Location: ./application/models/Project_model.php */