<?php

if (!defined('BASEPATH'))
    exit('No direct script access allowed');

class Speaker_outlines_model extends CI_Model {

    public $table = 'speaker_outlines';

    public function get_all() {
        return $this->db->get($this->table)->result();
    }

    public function get($id) {
//        $this->db->select('outline');
//        $this->db->from('speaker_outlines');
        return $this->db->where('speaker', $id)->get($this->table)->result();
    }

    public function add($json) {   
        foreach($json as $row) {
            if(array_key_exists("speaker",$row)) {
                $this->db->where('speaker', $row['speaker'])->delete($this->table);
            }
        }
        foreach($json as $row) {
            if($row['outline'] != 0){
                $this->db->insert($this->table, $row);
            }
        }  
    }

    public function update($json) {
        log_message('info', 'JSON ' . print_r($json), TRUE);
        foreach($json as $row) {
            $this->db->where('speaker', $row['speaker'])->delete($this->table);
        }
        $this->db->insert($this->table, $json);
//        return $this->db->where('speaker', $id)->update($this->table, $data);
    }

    public function delete($id) {
        $this->db->where('id', $id)->delete($this->table);
        return $this->db->affected_rows();
    }

}

/* End of file Project_model.php */
/* Location: ./application/models/Project_model.php */